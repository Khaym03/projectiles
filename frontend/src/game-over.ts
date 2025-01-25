export class GameOver {
    private onces = false
    constructor(private ctx: CanvasRenderingContext2D) {}

    draw() {
        this.ctx.font = 'bold 48px "Old Standard TT", serif'
        this.ctx.textAlign = 'center'

        this.ctx.fillText(
            `Game Over`,
            innerWidth / 2,
            innerHeight / 2
          )

        this.onces = true
        if (this.onces) setTimeout(()=> {location.reload()},3000)
    }
}