import { PongGame } from '../PongGame.js';

describe('PongGame', () => {
  let game: PongGame;

  beforeEach(() => {
    game = new PongGame();
  });

  test('should initialize with correct default state', () => {
    const state = game.getState();

    expect(state.gameWidth).toBe(800);
    expect(state.gameHeight).toBe(400);
    expect(state.score.left).toBe(0);
    expect(state.score.right).toBe(0);
    expect(state.ball.position.x).toBe(400);
    expect(state.ball.position.y).toBe(200);
  });

  test('should move paddles correctly', () => {
    const initialState = game.getState();
    const initialLeftY = initialState.leftPaddle.position.y;

    game.movePaddle('left', 'up');
    game.update();

    const updatedState = game.getState();
    expect(updatedState.leftPaddle.position.y).toBeLessThan(initialLeftY);
  });

  test('should update ball position', () => {
    const initialState = game.getState();
    const initialBallX = initialState.ball.position.x;
    const initialBallY = initialState.ball.position.y;

    game.update();

    const updatedState = game.getState();
    expect(updatedState.ball.position.x).not.toBe(initialBallX);
    expect(updatedState.ball.position.y).not.toBe(initialBallY);
  });

  test('should keep paddles within bounds', () => {
    // Move paddle beyond top boundary
    for (let i = 0; i < 100; i++) {
      game.movePaddle('left', 'up');
      game.update();
    }

    const state = game.getState();
    expect(state.leftPaddle.position.y).toBeGreaterThanOrEqual(0);
  });

  test('should detect ball collision with top/bottom walls', () => {
    const state = game.getState();

    // Force ball to top wall
    state.ball.position.y = 5;
    state.ball.velocity.y = -4;

    game.update();

    const updatedState = game.getState();
    expect(updatedState.ball.velocity.y).toBeGreaterThan(0); // Should bounce
  });

  test('should reset game correctly', () => {
    // Change game state
    game.movePaddle('left', 'up');
    game.update();

    // Reset and check
    game.reset();
    const state = game.getState();

    expect(state.ball.position.x).toBe(400);
    expect(state.ball.position.y).toBe(200);
    expect(state.score.left).toBe(0);
    expect(state.score.right).toBe(0);
  });
});
