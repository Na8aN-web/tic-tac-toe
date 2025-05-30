# Tic Tac Toe Game

A modern, fully-featured Tic Tac Toe game built with vanilla HTML, CSS, and JavaScript. Play against an intelligent computer opponent with multiple difficulty levels, complete with sound effects, accessibility features, and persistent game state.

## 🎮 Game Overview

This Tic Tac Toe implementation features a clean, responsive design with advanced gameplay mechanics. The game offers three difficulty levels, from random moves to strategic AI that will challenge even experienced players. All game progress is automatically saved and restored between sessions.

### Key Features

- **Intelligent AI Opponent**: Three difficulty levels with strategic gameplay
- **Persistent Game State**: Automatic save/load functionality using localStorage
- **Accessibility Support**: Full keyboard navigation and screen reader compatibility
- **Sound Effects**: Audio feedback for moves and game outcomes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Score Tracking**: Persistent scoring across multiple games
- **Undo Functionality**: Take back your last move(s)
- **High Contrast Mode**: Enhanced visibility option
- **Touch Support**: Optimized for mobile devices

## 🕹️ How to Play

### Basic Rules
1. You play as **X**, the computer plays as **O**
2. Players take turns placing their symbol on a 3×3 grid
3. First to get three symbols in a row (horizontal, vertical, or diagonal) wins
4. If all cells are filled without a winner, it's a draw

### Controls
- **Mouse**: Click on any empty cell to place your X
- **Keyboard**: Use arrow keys to navigate, Enter/Space to place your symbol
- **Touch**: Tap on empty cells (mobile devices)

### Game Options
- **New Game**: Reset the current game board
- **Difficulty**: Choose Easy, Medium, or Hard AI opponent
- **Undo**: Take back your last move (removes both your move and computer's response)
- **Audio Toggle**: Enable/disable sound effects
- **High Contrast**: Toggle high contrast mode for better visibility

### Difficulty Levels
- **Easy**: Computer makes random moves
- **Medium**: Computer uses strategy 70% of the time, random moves 30%
- **Hard**: Computer always uses optimal strategy (nearly unbeatable)

## 🔧 Technical Implementation

### Technologies Used
- **HTML5**: Semantic structure with accessibility attributes
- **CSS3**: Modern styling with flexbox, grid, and custom properties
- **Vanilla JavaScript**: No frameworks or libraries required

### Browser Compatibility
- Modern browsers (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- Mobile browsers (iOS Safari 12+, Chrome Mobile 60+)

### Performance Features
- Efficient DOM manipulation with minimal reflows
- Optimized event handling with event delegation where appropriate
- Lazy loading of audio resources
- Responsive design without heavy CSS frameworks

## 📁 Code Structure

### File Organization

tic-tac-toe/
├── index.html              # Main HTML structure
├── script.js               # Game logic and functionality
├── assets/
│   └── css/
│       ├── style.css       # Main stylesheet
│       └── additions.css   # Additional styles
├── sounds/
│   ├── click.mp3           # Move sound effect
│   ├── win.mp3             # Victory sound
│   ├── lose.mp3            # Defeat sound
│   └── tie.mp3             # Draw sound
└── README.md               # This file

### Core Components

#### Game State Management
```
const gameState = {
    currentPlayer: 'X',           // Current turn ('X' or 'O')
    board: Array(9).fill(''),     // Game board state
    gameActive: true,             // Whether game is in progress
    difficulty: 1,                // AI difficulty level (1-3)
    scores: { ... },              // Score tracking
    winningCombinations: [...],   // Win condition patterns
    winningLine: null,            // Indices of winning combination
    movesHistory: []              // Move history for undo functionality
}
```

#### Key Functions

**Game Logic**
- `initializeGame()`: Sets up game event listeners and UI
- `handleCellClick()`: Processes player moves
- `makeComputerMove()`: AI decision making
- `checkGameStatus()`: Win/draw detection
- `makeMove()`: Universal move handler

**AI Strategy**
- `makeRandomMove()`: Random cell selection (Easy mode)
- `makeStrategicMove()`: Strategic AI with win/block detection (Medium/Hard)
- `checkWinner()`: Utility function for AI decision making

**User Interface**
- `updateUI()`: Refreshes all visual elements
- `updateCell()`: Updates individual cell display
- `updateScoreDisplay()`: Updates score counters

**Persistence**
- `saveGameState()`: Stores game state to localStorage
- `loadGameState()`: Restores game state from localStorage

**Accessibility**
- `setupKeyboardNavigation()`: Arrow key and Enter support
- `setupHighContrastMode()`: Visual accessibility option

### AI Algorithm Details

The computer opponent uses a strategic algorithm in Medium and Hard modes:

1. **Win Detection**: If the computer can win on this turn, it does
2. **Block Detection**: If the player can win on their next turn, block them
3. **Center Control**: Take the center square if available
4. **Corner Strategy**: Prefer corners over edges
5. **Fallback**: Random move if no strategic option exists

## 🛠️ Development Notes

### Architecture Decisions

**State Management**: Used a centralized `gameState` object to maintain all game data, making debugging and persistence straightforward.

**Event Handling**: Implemented proper event delegation and cleanup to prevent memory leaks during game resets.

**AI Implementation**: Chose a rule-based approach over minimax for better performance and easier difficulty scaling.

**Persistence Strategy**: localStorage provides seamless save/restore without requiring a backend.

### Known Issues & Limitations

1. **Audio Autoplay**: Some browsers block audio autoplay; user interaction may be required
2. **localStorage Limits**: Game state is lost if user clears browser data
3. **AI Predictability**: Hard mode AI is deterministic (same position = same move)

### Browser Storage Usage

The game uses localStorage to persist:
- Current game board state
- Score history
- User preferences (audio, contrast, difficulty)
- Game settings and configuration

**Storage Keys Used:**
- `ticTacToeState`: Main game state
- `ticTacToeAudio`: Audio preference
- `ticTacToeContrast`: Contrast mode setting

### Performance Considerations

- **DOM Updates**: Minimal DOM manipulation with batch updates
- **Memory Management**: Event listeners properly cleaned up on reset
- **Audio Loading**: Sounds loaded on demand to reduce initial load time
- **Responsive Images**: No images used to minimize load time

### Accessibility Features

- **ARIA Labels**: All interactive elements properly labeled
- **Keyboard Navigation**: Full game playability without mouse
- **Screen Reader Support**: Live regions for status updates
- **High Contrast Mode**: Enhanced visual accessibility
- **Focus Management**: Proper focus handling during keyboard navigation

### Future Enhancement Ideas

1. **Multiplayer Mode**: Local two-player option
2. **Online Play**: WebSocket-based multiplayer
3. **Game Analytics**: Move pattern analysis and statistics
4. **Themes**: Multiple visual themes and color schemes
5. **Tournament Mode**: Multiple games with bracket-style progression
6. **AI Personality**: Different computer opponents with unique strategies
7. **Animated Moves**: Smooth transitions and move animations
8. **Game History**: Detailed move-by-move game replay

### Testing Recommendations

- Test across different screen sizes and orientations
- Verify keyboard navigation works completely
- Test audio functionality across browsers
- Validate localStorage persistence
- Test undo functionality in various game states
- Verify AI behavior at each difficulty level

### Contributing

When modifying this code:
1. Maintain the centralized state management pattern
2. Preserve accessibility features
3. Test across multiple devices and browsers
4. Ensure localStorage operations are wrapped in try/catch blocks
5. Maintain backward compatibility for saved game states

---

**Version**: 1.0  
**Last Updated**: May 2025  
**License**: MIT