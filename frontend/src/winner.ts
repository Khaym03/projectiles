import WinnerVideo from '@/assets/gato.mp4'

export class Winner {
  private onces = true
  private video = document.createElement('video')
  constructor() {
    this.video.src = WinnerVideo
    this.video.muted = false
    this.video.loop = false
    this.video.controls = false
    this.video.volume = 0.9
  }

  show() {
    this.video.style.zIndex = '20'
    this.video.style.position = 'absolute'
    this.video.style.top = '0'
    this.video.style.left = '0'
    this.video.style.width = '100%'
    this.video.style.height = '100%'

    if (this.onces) {
      document.body.appendChild(this.video)
      this.video.play()
      setTimeout(() => {
        location.reload()
      }, this.video.duration * 1000 + 500)
    }
    this.onces = false
  }
}
