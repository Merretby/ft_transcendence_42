// Types for the game entities
export interface Vector2D {
  x: number;
  y: number;
}

export interface Ball {
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
}

export interface Paddle {
  position: Vector2D;
  velocity: Vector2D;
  width: number;
  height: number;
}

export interface GameState {
  ball: Ball;
  leftPaddle: Paddle;
  rightPaddle: Paddle;
  score: {
    left: number;
    right: number;
  };
  gameWidth: number;
  gameHeight: number;
}

export class PongGame {
  private state: GameState;
  private readonly paddleSpeed: number = 5;
  private readonly ballSpeed: number = 4;

  constructor(width: number = 800, height: number = 400) {
    this.state = this.initializeGame(width, height);
  }

  private initializeGame(width: number, height: number): GameState {
    return {
      gameWidth: width,
      gameHeight: height,
      ball: {
        position: { x: width / 2, y: height / 2 },
        velocity: { x: this.ballSpeed, y: this.ballSpeed * 0.5 },
        radius: 10
      },
      leftPaddle: {
        position: { x: 20, y: height / 2 - 50 },
        velocity: { x: 0, y: 0 },
        width: 10,
        height: 100
      },
      rightPaddle: {
        position: { x: width - 30, y: height / 2 - 50 },
        velocity: { x: 0, y: 0 },
        width: 10,
        height: 100
      },
      score: { left: 0, right: 0 }
    };
  }

  // Get current game state (read-only)
  getState(): Readonly<GameState> {
    return { ...this.state };
  }

  // Move paddle (for AI or human input)
  movePaddle(paddle: 'left' | 'right', direction: 'up' | 'down' | 'stop') {
    const targetPaddle = paddle === 'left' ? this.state.leftPaddle : this.state.rightPaddle;

    switch (direction) {
      case 'up':
        targetPaddle.velocity.y = -this.paddleSpeed;
        break;
      case 'down':
        targetPaddle.velocity.y = this.paddleSpeed;
        break;
      case 'stop':
        targetPaddle.velocity.y = 0;
        break;
    }
  }

  // Update game physics (call this each frame)
  update(deltaTime: number = 1): void {
    this.updatePaddles();
    this.updateBall();
    this.checkCollisions();
    this.checkBounds();
  }

  private updatePaddles(): void {
    // Update left paddle
    this.state.leftPaddle.position.y += this.state.leftPaddle.velocity.y;
    this.keepPaddleInBounds(this.state.leftPaddle);

    // Update right paddle
    this.state.rightPaddle.position.y += this.state.rightPaddle.velocity.y;
    this.keepPaddleInBounds(this.state.rightPaddle);
  }

  private keepPaddleInBounds(paddle: Paddle): void {
    if (paddle.position.y < 0) {
      paddle.position.y = 0;
    }
    if (paddle.position.y + paddle.height > this.state.gameHeight) {
      paddle.position.y = this.state.gameHeight - paddle.height;
    }
  }

  private updateBall(): void {
    this.state.ball.position.x += this.state.ball.velocity.x;
    this.state.ball.position.y += this.state.ball.velocity.y;
  }

  private checkCollisions(): void {
    const ball = this.state.ball;

    // Ball collision with top/bottom walls
    if (ball.position.y - ball.radius <= 0 || ball.position.y + ball.radius >= this.state.gameHeight) {
      ball.velocity.y *= -1;
      // Keep ball in bounds
      ball.position.y = Math.max(ball.radius, Math.min(this.state.gameHeight - ball.radius, ball.position.y));
    }

    // Ball collision with paddles
    this.checkPaddleCollision(this.state.leftPaddle);
    this.checkPaddleCollision(this.state.rightPaddle);
  }

  private checkPaddleCollision(paddle: Paddle): void {
    const ball = this.state.ball;

    // Simple AABB collision detection
    const ballLeft = ball.position.x - ball.radius;
    const ballRight = ball.position.x + ball.radius;
    const ballTop = ball.position.y - ball.radius;
    const ballBottom = ball.position.y + ball.radius;

    const paddleLeft = paddle.position.x;
    const paddleRight = paddle.position.x + paddle.width;
    const paddleTop = paddle.position.y;
    const paddleBottom = paddle.position.y + paddle.height;

    if (ballRight >= paddleLeft && ballLeft <= paddleRight &&
        ballBottom >= paddleTop && ballTop <= paddleBottom) {

      // Reverse horizontal velocity
      ball.velocity.x *= -1;

      // Add some angle based on where it hit the paddle
      const hitPosition = (ball.position.y - paddle.position.y) / paddle.height;
      const angleInfluence = (hitPosition - 0.5) * 2; // -1 to 1
      ball.velocity.y += angleInfluence * 2;

      // Keep ball speed consistent
      const speed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);
      const normalizedSpeed = this.ballSpeed;
      ball.velocity.x = (ball.velocity.x / speed) * normalizedSpeed;
      ball.velocity.y = (ball.velocity.y / speed) * normalizedSpeed;
    }
  }

  private checkBounds(): void {
    const ball = this.state.ball;

    // Ball went off left side - right player scores
    if (ball.position.x < 0) {
      this.state.score.right++;
      this.resetBall();
    }

    // Ball went off right side - left player scores
    if (ball.position.x > this.state.gameWidth) {
      this.state.score.left++;
      this.resetBall();
    }
  }

  private resetBall(): void {
    this.state.ball.position = {
      x: this.state.gameWidth / 2,
      y: this.state.gameHeight / 2
    };

    // Random direction
    const direction = Math.random() > 0.5 ? 1 : -1;
    this.state.ball.velocity = {
      x: this.ballSpeed * direction,
      y: (Math.random() - 0.5) * this.ballSpeed
    };
  }

  // Reset the entire game
  reset(): void {
    this.state = this.initializeGame(this.state.gameWidth, this.state.gameHeight);
  }

  // Check if game is over (optional - for game modes with win conditions)
  isGameOver(maxScore: number = 5): boolean {
    return this.state.score.left >= maxScore || this.state.score.right >= maxScore;
  }
}
