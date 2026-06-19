// A tiny shared lock so one transition owns one gesture. When the page switches
// between the intro overture and home, the trackpad/touch inertia trailing that
// swipe keeps firing events — without a lock it would instantly trigger the
// opposite-direction handler and bounce back. Both Intro and App consult this:
// a single flick stays crisp, only the leftover momentum during the window is
// swallowed.

let lockedUntil = 0

export function lockGestures(ms = 650) {
  lockedUntil = Date.now() + ms
}

export function gesturesLocked() {
  return Date.now() < lockedUntil
}
