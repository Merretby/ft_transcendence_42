import { PongGame } from './PongGame.js';

// Create a simple demonstration of the headless Pong game
function runGameSimulation() {
  console.log('🏓 Pong AI Sandbox - Headless Game Simulation');
  console.log('==========================================');

  const game = new PongGame();

  // Simulate a few game frames
  console.log('\nInitial game state:');
  logGameState(game);

  // Simulate some gameplay
  console.log('\n🎮 Simulating 10 frames of gameplay...');
  for (let frame = 1; frame <= 10; frame++) {
    // Simple AI: move paddles toward ball
    const state = game.getState();

    // Left paddle AI
    if (state.ball.position.y > state.leftPaddle.position.y + state.leftPaddle.height / 2) {
      game.movePaddle('left', 'down');
    } else {
      game.movePaddle('left', 'up');
    }

    // Right paddle AI
    if (state.ball.position.y > state.rightPaddle.position.y + state.rightPaddle.height / 2) {
      game.movePaddle('right', 'down');
    } else {
      game.movePaddle('right', 'up');
    }

    game.update();

    console.log(`Frame ${frame}: Ball at (${state.ball.position.x.toFixed(1)}, ${state.ball.position.y.toFixed(1)})`);
  }

  console.log('\nFinal game state:');
  logGameState(game);

  console.log('\n✅ Game simulation complete!');
  console.log('🧪 Run tests with: npm test');
  console.log('🏗️  This headless game is ready for AI development!');
}

function logGameState(game: PongGame) {
  const state = game.getState();
  console.log(`  Ball: (${state.ball.position.x.toFixed(1)}, ${state.ball.position.y.toFixed(1)})`);
  console.log(`  Left Paddle: y=${state.leftPaddle.position.y.toFixed(1)}`);
  console.log(`  Right Paddle: y=${state.rightPaddle.position.y.toFixed(1)}`);
  console.log(`  Score: ${state.score.left} - ${state.score.right}`);
}

// Run the simulation
runGameSimulation();
