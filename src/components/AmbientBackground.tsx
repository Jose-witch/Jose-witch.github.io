import { useEffect, useRef } from 'react'

/**
 * A full-screen ambient layer that sits *behind* everything (the home stage and
 * the frosted panel both float above it, so it shows through on every view).
 *
 * The motif is **flowing ink / smoke** — a slow, painterly fluid in the dark,
 * closer to a darkroom developing or ink bleeding into water than to anything
 * technical. Two inks, warm red and cool blue, curl and seep through each other
 * with uneven density and brushed edges, then dissipate. Built from
 * domain-warped fbm so the structure has *grain and stroke*, never the even glow
 * of a data network.
 *
 * WebGL fragment shader — a continuous fluid field is exactly what a shader is
 * for. The centre column stays calmer so the figure + type remain the hero.
 * Honors prefers-reduced-motion with a single static frame, and degrades
 * silently to the CSS gradient if WebGL is unavailable.
 *
 * NB: deliberately never calls WEBGL_lose_context — under React.StrictMode the
 * effect mounts → unmounts → remounts, and losing the context on the first
 * unmount poisons the canvas so the remount renders nothing.
 */
export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl =
      canvas.getContext('webgl', { antialias: false, alpha: true }) ||
      (canvas.getContext('experimental-webgl', {
        antialias: false,
        alpha: true,
      }) as WebGLRenderingContext | null)
    if (!gl) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const VERT = `
      attribute vec2 a_pos;
      void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
    `

    // Palette from styles/theme.ts: bg #16110b, red #d8412f, blue #3e567f.
    const FRAG = `
      precision highp float;
      uniform vec2  u_res;
      uniform float u_time;
      uniform vec2  u_mouse;

      float hash(vec2 p){
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      float noise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        f = f*f*(3.0-2.0*f);
        float a = hash(i), b = hash(i+vec2(1,0));
        float c = hash(i+vec2(0,1)), d = hash(i+vec2(1,1));
        return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
      }
      float fbm(vec2 p){
        float v = 0.0, amp = 0.5;
        for(int i=0;i<6;i++){
          v += amp * noise(p);
          p = p*2.03 + vec2(7.3, 1.7);
          amp *= 0.5;
        }
        return v;
      }

      // Domain-warped fbm — the warp is what gives the ink its curl & stroke,
      // instead of a flat cloud. Returns density plus the warp vector so we can
      // tint by flow direction (two inks separating).
      float inkField(vec2 p, float t, out vec2 warp){
        vec2 q = vec2(fbm(p + vec2(0.0, t*0.15)),
                      fbm(p + vec2(5.2, -t*0.12) + 1.7));
        vec2 r = vec2(fbm(p + 3.0*q + vec2(1.7 - t*0.1, 9.2)),
                      fbm(p + 3.0*q + vec2(8.3, 2.8 + t*0.08)));
        warp = r;
        return fbm(p + 2.4*r);
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        float aspect = u_res.x / u_res.y;
        vec2 p = uv; p.x *= aspect;
        p *= 2.2;

        float t = u_time * 0.06;

        // mouse stirs the ink locally — a slow vortex following the cursor
        vec2 m = u_mouse; m.x *= aspect; m *= 2.2;
        float md = distance(p, m);
        vec2 stir = vec2(-(p.y - m.y), (p.x - m.x)) * exp(-md*1.2) * 0.5;

        vec2 warp;
        float d = inkField(p + stir, t, warp);

        // shape the density: lift the dense ridges, crush the lulls to black so
        // the ink has brushed edges & negative space, not an even fog.
        float ink = smoothstep(0.42, 0.92, d);
        ink = pow(ink, 1.4);

        // two inks separated by flow direction: warp.x leaning warm, warp.y cool
        float warmth = smoothstep(0.35, 0.75, warp.x);
        float coolth = smoothstep(0.32, 0.72, warp.y);

        // refined brutalist: near-black ground, one faint brick smoke. No blue.
        vec3 base = vec3(0.086, 0.086, 0.086);         // #161616
        vec3 brick = vec3(0.549, 0.184, 0.141);        // #8c2f24

        // centre column stays calmer — the smoke thins where text + figure live
        float edge = smoothstep(0.16, 0.62, abs(uv.x - 0.5) * 2.0);
        float amt = ink * (0.18 + 0.42 * edge);        // kept low / restrained

        // a single ink, leaning on whichever flow component is stronger, so the
        // smoke has structure without a second hue
        float tone = max(warmth, coolth);
        vec3 col = base;
        col = mix(col, col + brick * 0.5, amt * tone);

        // soft vignette toward true black
        float vig = smoothstep(1.18, 0.32, distance(uv, vec2(0.5, 0.46)));
        col *= mix(0.46, 1.0, vig);

        // fine paper grain so it sits with the existing film-grain layer
        col += (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.014;

        gl_FragColor = vec4(col, 1.0);
      }
    `

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      return sh
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const resize = () => {
      const w = Math.floor(window.innerWidth * dpr)
      const h = Math.floor(window.innerHeight * dpr)
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uRes, w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    const mouse = { x: 0.5, y: 0.52 }
    const target = { x: 0.5, y: 0.52 }
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth
      target.y = 1 - e.clientY / window.innerHeight
    }
    window.addEventListener('pointermove', onMove)

    let raf = 0
    const start = performance.now()
    const draw = () => {
      const time = reduce ? 12.0 : (performance.now() - start) / 1000
      mouse.x += (target.x - mouse.x) * 0.03
      mouse.y += (target.y - mouse.y) * 0.03
      gl.uniform1f(uTime, time)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (!reduce) raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      // NB: no loseContext() — see component note (StrictMode remount).
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}
