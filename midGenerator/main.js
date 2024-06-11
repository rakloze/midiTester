import AudioController from './audio.js';

const audioController = new AudioController();

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start-button');
    let context;

    function initializeAudioContext() {
        if (!context) {
            context = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (context.state === 'suspended') {
            context.resume();
        }
    }

    startButton.addEventListener('click', function() {
        startGame();
    });

    document.querySelectorAll('.fret button').forEach(button => {
        button.addEventListener('click', handleFretClick);
    });

    function handleFretClick(event) {
        const button = event.target;
        const note = button.getAttribute('data-note');

        // Initialize AudioContext
        initializeAudioContext();

        if (note) {
            playNoteWithReverb(note);
        }
    }

    function playNoteWithReverb(note) {
        try {
            audioController.playNoteWithReverb(note);
        } catch (error) {
            console.error(error.message);
        }
    }

    function startGame() {
        console.log('Game started');
        // Implement game logic here
    }

    // Example function to play square wave sound
    window.playSquareWave = function(note) {
        try {
            audioController.playSquareWave(note);
        } catch (error) {
            console.error(error.message);
        }
    };
});
