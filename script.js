// Fluence - Landing Page Interactions

document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initPlatformSwitcher();
    initSimulator();
    initSetupWizard();
    initWindowsWizard();
    initDocsScrollSpy();
});

/* 1. Navbar Scroll Effect */
function initNavbarScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.75)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.webkitBackdropFilter = 'blur(20px)';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
        } else {
            header.style.backgroundColor = 'transparent';
            header.style.backdropFilter = 'none';
            header.style.webkitBackdropFilter = 'none';
            header.style.borderBottom = 'none';
        }
    });
}

/* 2. Platform Switcher (Android | Windows) */
function initPlatformSwitcher() {
    const tabAndroidBtn = document.getElementById('tab-btn-android');
    const tabWindowsBtn = document.getElementById('tab-btn-windows');
    const showcaseAndroid = document.getElementById('showcase-android');
    const showcaseWindows = document.getElementById('showcase-windows');

    if (!tabAndroidBtn || !tabWindowsBtn || !showcaseAndroid || !showcaseWindows) return;

    function switchPlatform(platform) {
        if (platform === 'android') {
            tabAndroidBtn.classList.add('active');
            tabWindowsBtn.classList.remove('active');
            
            // Cross-fade transitions
            showcaseWindows.classList.remove('active');
            setTimeout(() => {
                showcaseWindows.style.display = 'none';
                showcaseAndroid.style.display = 'flex';
                setTimeout(() => {
                    showcaseAndroid.classList.add('active');
                }, 20);
            }, 300);
            
            // Global state tracking for waveform animation
            window.activePlatform = 'android';
        } else {
            tabWindowsBtn.classList.add('active');
            tabAndroidBtn.classList.remove('active');
            
            // Cross-fade transitions
            showcaseAndroid.classList.remove('active');
            setTimeout(() => {
                showcaseAndroid.style.display = 'none';
                showcaseWindows.style.display = 'flex';
                setTimeout(() => {
                    showcaseWindows.classList.add('active');
                }, 20);
            }, 300);
            
            // Global state tracking for waveform animation
            window.activePlatform = 'windows';
        }
    }

    tabAndroidBtn.addEventListener('click', () => switchPlatform('android'));
    tabWindowsBtn.addEventListener('click', () => switchPlatform('windows'));
    
    // Set initial active state
    window.activePlatform = 'android';
}

/* 3. Interactive Simulator State Machine (Handles both Android and Windows) */
function initSimulator() {
    // --- Android Elements ---
    const floatingBubble = document.getElementById('sim-bubble');
    const overlayPill = document.getElementById('sim-overlay-pill');
    const bottomVoiceBar = document.getElementById('sim-voice-bar');
    const voiceStatusText = document.getElementById('sim-voice-status');
    const notepadBody = document.getElementById('sim-notepad-body');
    const waveformPath = document.getElementById('sim-waveform-path');
    const waveformPathBg = document.getElementById('sim-waveform-path-bg');

    // --- Windows Elements ---
    const sidebarTabs = document.querySelectorAll('.desktop-sidebar .sidebar-tab');
    const slideshowSlides = document.querySelectorAll('.desktop-slideshow .slideshow-slide');
    const tryHotkeyBtn = document.getElementById('btn-desktop-demo');
    const desktopEditor = document.getElementById('desktop-editor');
    const desktopEditorBody = document.getElementById('desktop-editor-body');
    const desktopOverlayPill = document.getElementById('desktop-overlay-pill');
    const shortcutToast = document.getElementById('shortcut-toast');
    const desktopWaveformPath = document.getElementById('desktop-waveform-path');
    const desktopWaveformPathBg = document.getElementById('desktop-waveform-path-bg');

    // Safety Check
    if (!floatingBubble && !tryHotkeyBtn) return;

    let isSimulating = false;
    let wavePhase = 0;
    let waveAmplitude = 0;
    let waveTargetAmplitude = 0;
    let animationId = null;
    
    // Initial and Demo text configs
    const originalAndroidText = 'Hello World!<br>';
    const transcriptionAndroidText = 'Fluence transcribes sentences in under a second with human-level accuracy.';
    
    const originalWindowsText = 'Click "Try Hotkey Dictation" in the sidebar to simulate typing in any Windows app...';
    const transcriptionWindowsText = 'Fluence for Windows runs quietly in your system tray. Pressing the global shortcut inserts your words directly into the cursor position instantly.';

    // Setup initial text
    if (notepadBody) {
        notepadBody.innerHTML = originalAndroidText + '<span class="typing-cursor"></span>';
    }

    // SVG Waveform Drawing loop (REUSED DRY FOR BOTH PLATFORMS)
    function animateWave() {
        if (!isSimulating) return;
        
        // Interpolate amplitude smoothly
        waveAmplitude += (waveTargetAmplitude - waveAmplitude) * 0.1;
        
        const width = 160;
        const height = 32;
        const points = [];
        const pointsBg = [];
        
        // Generate points for double sine wave
        for (let x = 0; x <= width; x += 2) {
            // Main wave: sine wave with envelope function to pinch the edges
            const envelope = Math.sin((x / width) * Math.PI); 
            const y1 = (height / 2) + Math.sin(x * 0.09 + wavePhase) * waveAmplitude * envelope;
            // Back/secondary wave (shifted phase/frequency for rich layered look)
            const y2 = (height / 2) + Math.sin(x * 0.075 - wavePhase * 0.8) * (waveAmplitude * 0.65) * envelope;
            
            points.push(`${x},${y1}`);
            pointsBg.push(`${x},${y2}`);
        }
        
        // Target active platform's SVG paths
        if (window.activePlatform === 'android') {
            if (waveformPath && waveformPathBg) {
                waveformPath.setAttribute('d', `M ${points.join(' L ')}`);
                waveformPathBg.setAttribute('d', `M ${pointsBg.join(' L ')}`);
            }
        } else {
            if (desktopWaveformPath && desktopWaveformPathBg) {
                desktopWaveformPath.setAttribute('d', `M ${points.join(' L ')}`);
                desktopWaveformPathBg.setAttribute('d', `M ${pointsBg.join(' L ')}`);
            }
        }
        
        wavePhase += 0.15;
        animationId = requestAnimationFrame(animateWave);
    }

    // --- Android Simulation Sequence ---
    function startAndroidSimulation() {
        if (isSimulating) return;
        isSimulating = true;
        
        // Clear text immediately, show cursor
        if (notepadBody) notepadBody.innerHTML = '<span class="typing-cursor"></span>';
        
        // Active bubble styling
        if (floatingBubble) floatingBubble.classList.add('active');
        if (overlayPill) overlayPill.classList.add('active');
        if (bottomVoiceBar) bottomVoiceBar.classList.add('active');
        
        // Start Waveform drawing
        waveAmplitude = 0;
        waveTargetAmplitude = 12; // High wave amplitude for recording state
        animateWave();
        
        // 1. Listening State (3 seconds)
        let timerCount = 0;
        if (voiceStatusText) voiceStatusText.textContent = `Listening... (00:00)`;
        
        const timerInterval = setInterval(() => {
            timerCount++;
            if (voiceStatusText) voiceStatusText.textContent = `Listening... (00:0${timerCount})`;
            if (timerCount >= 3) {
                clearInterval(timerInterval);
                transitionToAndroidTranscribing();
            }
        }, 1000);
    }
    
    function transitionToAndroidTranscribing() {
        if (voiceStatusText) voiceStatusText.textContent = 'Transcribing...';
        waveTargetAmplitude = 1.5; // low wiggle for processing state
        
        if (overlayPill) overlayPill.classList.add('success');
        
        setTimeout(() => {
            // Hide bar and overlay
            if (overlayPill) {
                overlayPill.classList.remove('active');
                overlayPill.classList.remove('success');
            }
            if (bottomVoiceBar) bottomVoiceBar.classList.remove('active');
            if (floatingBubble) floatingBubble.classList.remove('active');
            
            // Stop wave loop
            setTimeout(() => {
                isSimulating = false;
                cancelAnimationFrame(animationId);
            }, 500);
            
            // Start typing
            startAndroidTyping();
        }, 1500);
    }
    
    function startAndroidTyping() {
        let charIndex = 0;
        if (notepadBody) notepadBody.innerHTML = '<span class="typing-cursor"></span>';
        
        function typeNextChar() {
            if (charIndex < transcriptionAndroidText.length) {
                const currentText = transcriptionAndroidText.substring(0, charIndex + 1);
                if (notepadBody) notepadBody.innerHTML = currentText + '<span class="typing-cursor"></span>';
                charIndex++;
                setTimeout(typeNextChar, 30); // 30ms per character typing speed
            } else {
                setTimeout(resetAndroidNotepad, 4000);
            }
        }
        setTimeout(typeNextChar, 300);
    }
    
    function resetAndroidNotepad() {
        if (isSimulating) return;
        if (notepadBody) notepadBody.innerHTML = originalAndroidText + '<span class="typing-cursor"></span>';
    }

    // --- Windows Slideshow Selector Navigation ---
    sidebarTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active classes
            sidebarTabs.forEach(t => t.classList.remove('active'));
            slideshowSlides.forEach(s => s.classList.remove('active'));
            
            // Close Notepad mockup if open
            if (desktopEditor) desktopEditor.classList.remove('active');
            
            // Add active classes to current tab and slide
            tab.classList.add('active');
            const targetTab = tab.getAttribute('data-tab');
            const targetSlide = document.querySelector(`.desktop-slideshow [data-slide="${targetTab}"]`);
            if (targetSlide) {
                targetSlide.classList.add('active');
            }
        });
    });

    // --- Windows Dictation Simulation Sequence ---
    function startWindowsSimulation() {
        if (isSimulating) return;
        isSimulating = true;

        // Show global hotkey indicator overlay first
        if (shortcutToast) shortcutToast.classList.add('active');

        setTimeout(() => {
            // Fade out hotkey notification, slide editor mock panel into view
            if (shortcutToast) shortcutToast.classList.remove('active');
            if (desktopEditor) desktopEditor.classList.add('active');
            if (desktopEditorBody) desktopEditorBody.innerHTML = '<span class="typing-cursor"></span>';

            // Show floating recording overlay pill
            if (desktopOverlayPill) desktopOverlayPill.classList.add('active');

            // Start wave loop drawing
            waveAmplitude = 0;
            waveTargetAmplitude = 12; // recording wave amplitude
            animateWave();

            // Simulate listening (2.5 seconds)
            setTimeout(() => {
                // Transition to transcribing wiggle
                waveTargetAmplitude = 1.5; 
                
                if (desktopOverlayPill) desktopOverlayPill.classList.add('success');

                // Hide overlay pill
                setTimeout(() => {
                    if (desktopOverlayPill) {
                        desktopOverlayPill.classList.remove('active');
                        desktopOverlayPill.classList.remove('success');
                    }
                    
                    // Stop animation loop
                    setTimeout(() => {
                        isSimulating = false;
                        cancelAnimationFrame(animationId);
                    }, 500);

                    // Start typewriter text injection
                    startWindowsTyping();
                }, 1500);
            }, 2500);

        }, 1200); // Display shortcut keys overlay for 1.2 seconds
    }

    function startWindowsTyping() {
        let charIndex = 0;
        if (desktopEditorBody) desktopEditorBody.innerHTML = '<span class="typing-cursor"></span>';

        function typeNextChar() {
            if (charIndex < transcriptionWindowsText.length) {
                const currentText = transcriptionWindowsText.substring(0, charIndex + 1);
                if (desktopEditorBody) desktopEditorBody.innerHTML = currentText + '<span class="typing-cursor"></span>';
                charIndex++;
                setTimeout(typeNextChar, 25); // Faster typing speed on desktop (25ms)
            } else {
                // Done. Pause for 5 seconds and reset panel view back to slideshow slide
                setTimeout(resetWindowsShowcase, 5000);
            }
        }
        setTimeout(typeNextChar, 400);
    }

    function resetWindowsShowcase() {
        if (isSimulating) return;
        if (desktopEditor) desktopEditor.classList.remove('active');
        if (desktopEditorBody) desktopEditorBody.innerHTML = originalWindowsText;
    }

    // Attach click events
    if (floatingBubble) floatingBubble.addEventListener('click', startAndroidSimulation);
    if (tryHotkeyBtn) tryHotkeyBtn.addEventListener('click', startWindowsSimulation);
}

/* 4. Setup Wizard Interactions (Android Specific) */
function initSetupWizard() {
    // Password toggle
    const toggleBtn = document.getElementById('btn-toggle-key');
    const inputField = document.getElementById('groq-key-input');
    const saveBtn = document.getElementById('btn-save-key');
    const saveStatus = document.getElementById('save-status');
    
    if (toggleBtn && inputField) {
        toggleBtn.addEventListener('click', () => {
            if (inputField.type === 'password') {
                inputField.type = 'text';
                toggleBtn.textContent = 'Hide';
            } else {
                inputField.type = 'password';
                toggleBtn.textContent = 'Show';
            }
        });
    }
    
    // Save key action
    if (saveBtn && saveStatus) {
        saveBtn.addEventListener('click', () => {
            saveStatus.style.opacity = '1';
            saveBtn.textContent = 'Saved';
            setTimeout(() => {
                saveStatus.style.opacity = '0';
                saveBtn.textContent = 'Save';
            }, 3000);
        });
    }
    
    // Accessibility switch toggle
    const switchEl = document.getElementById('switch-service');
    if (switchEl) {
        switchEl.addEventListener('click', () => {
            switchEl.classList.toggle('active');
            const timelineCircle = document.getElementById('step-3-circle');
            if (timelineCircle) {
                if (switchEl.classList.contains('active')) {
                    timelineCircle.classList.add('active');
                } else {
                    timelineCircle.classList.remove('active');
                }
            }
        });
    }
}

/* 5. Simulated Onboarding Wizard for Windows (Tauri replica) */
function initWindowsWizard() {
    const wizardWindow = document.querySelector('.tauri-wizard-window');
    if (!wizardWindow) return;

    const TOTAL_STEPS = 6;
    let currentStep = 1;
    let wizardData = {
        provider: 'groq',
        baseUrl: 'https://api.groq.com/openai',
        apiKey: '',
        model: 'whisper-large-v3',
        llmModel: 'llama-3.3-70b-versatile',
        hotkey: 'Ctrl+Shift+Space',
        recordingMode: 'push_to_toggle',
        overlayPosition: 'bottom_right'
    };

    const PROVIDER_PRESETS = {
        groq:   { url: 'https://api.groq.com/openai', model: 'whisper-large-v3', llmModel: 'llama-3.3-70b-versatile' },
        openai: { url: 'https://api.openai.com',      model: 'whisper-1',        llmModel: 'gpt-4o' },
        custom: { url: '',                             model: '',                 llmModel: '' }
    };

    const prevBtn = wizardWindow.querySelector('#prev-btn');
    const nextBtn = wizardWindow.querySelector('#next-btn');
    const progressFill = wizardWindow.querySelector('#progress-fill');
    const stepDots = wizardWindow.querySelectorAll('.step-dot');

    // Titlebar Close Button simulation
    const closeTitlebarBtn = wizardWindow.querySelector('#sim-wiz-close');
    if (closeTitlebarBtn) {
        closeTitlebarBtn.addEventListener('click', () => {
            if (confirm('Do you want to exit the setup wizard? Settings will not be saved.')) {
                updateStep(1);
            }
        });
    }

    // Step navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) updateStep(currentStep - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < TOTAL_STEPS) {
                    updateStep(currentStep + 1);
                }
            }
        });
    }

    function updateStep(step) {
        // Animate out current
        const currentEl = wizardWindow.querySelector(`#step-${currentStep}`);
        if (currentEl && step !== currentStep) {
            currentEl.classList.add('exit-left');
            setTimeout(() => {
                currentEl.classList.remove('active', 'exit-left');
            }, 350);
        }

        currentStep = step;

        // Animate in new
        const nextEl = wizardWindow.querySelector(`#step-${step}`);
        if (nextEl) {
            setTimeout(() => {
                nextEl.classList.add('active');
            }, 50);
        }

        // Update progress bar
        const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;
        if (progressFill) progressFill.style.width = `${progress}%`;

        // Update dots
        stepDots.forEach(dot => {
            const dotStep = parseInt(dot.dataset.dot);
            dot.classList.remove('active', 'done');
            if (dotStep === step) dot.classList.add('active');
            else if (dotStep < step) dot.classList.add('done');
        });

        // Update buttons visibility
        if (prevBtn) {
            prevBtn.style.visibility = (step > 1 && step < TOTAL_STEPS) ? 'visible' : 'hidden';
        }

        if (nextBtn) {
            if (step === TOTAL_STEPS) {
                nextBtn.classList.add('hidden');
            } else {
                nextBtn.classList.remove('hidden');
                nextBtn.textContent = step === 1 ? 'Get Started' : (step === TOTAL_STEPS - 1 ? 'Finish Setup' : 'Continue →');
            }
        }
    }

    function validateStep(step) {
        if (step === 2) {
            const key = wizardWindow.querySelector('#wiz-api-key').value.trim();
            if (!key) {
                alert('Please enter your API Key to proceed.');
                return false;
            }
            wizardData.apiKey = key;
            wizardData.baseUrl = wizardWindow.querySelector('#wiz-base-url').value.trim() || wizardData.baseUrl;
        }
        return true;
    }

    // Step 2: Provider selection
    const providerCards = wizardWindow.querySelectorAll('.provider-card');
    providerCards.forEach(card => {
        card.addEventListener('click', () => {
            providerCards.forEach(c => {
                c.classList.remove('selected');
                c.style.borderColor = 'rgba(255,255,255,0.08)';
                c.style.background = 'rgba(255,255,255,0.02)';
                c.style.color = '#b9cacb';
            });
            card.classList.add('selected');
            card.style.borderColor = '';
            card.style.background = '';
            card.style.color = '';

            const preset = card.dataset.provider;
            wizardData.provider = preset;

            const p = PROVIDER_PRESETS[preset];
            if (p) {
                const baseUrlInput = wizardWindow.querySelector('#wiz-base-url');
                if (baseUrlInput) baseUrlInput.value = p.url;
                wizardData.baseUrl = p.url;
            }
        });
    });

    // Step 2: Test connection button
    const testBtnEl = wizardWindow.querySelector('#wiz-test-btn');
    const testDot = wizardWindow.querySelector('#wiz-test-dot');
    const testText = wizardWindow.querySelector('#wiz-test-text');

    if (testBtnEl) {
        testBtnEl.addEventListener('click', () => {
            if (testDot) {
                testDot.style.backgroundColor = '#f59e0b';
                testDot.style.boxShadow = '0 0 8px #f59e0b';
            }
            if (testText) {
                testText.textContent = 'Testing connection...';
                testText.style.color = '#f59e0b';
            }
            testBtnEl.disabled = true;

            setTimeout(() => {
                const key = wizardWindow.querySelector('#wiz-api-key').value.trim();
                if (!key) {
                    if (testDot) {
                        testDot.style.backgroundColor = '#ef4444';
                        testDot.style.boxShadow = '0 0 8px #ef4444';
                    }
                    if (testText) {
                        testText.textContent = 'Connection failed: Missing Key';
                        testText.style.color = '#ef4444';
                    }
                } else {
                    if (testDot) {
                        testDot.style.backgroundColor = '#6fcf97';
                        testDot.style.boxShadow = '0 0 8px #6fcf97';
                    }
                    if (testText) {
                        testText.textContent = 'Groq Whisper API Connected!';
                        testText.style.color = '#6fcf97';
                    }
                }
                testBtnEl.disabled = false;
            }, 1200);
        });
    }

    // Step 3: Hotkey display recording
    const hotkeyDisplay = wizardWindow.querySelector('#wiz-hotkey-display');
    const hotkeyText = wizardWindow.querySelector('#wiz-hotkey-text');
    let isRecordingHotkey = false;

    if (hotkeyDisplay) {
        hotkeyDisplay.addEventListener('click', () => {
            if (isRecordingHotkey) return;
            isRecordingHotkey = true;
            hotkeyDisplay.classList.add('recording');
            if (hotkeyText) hotkeyText.textContent = 'Press your shortcut...';
        });

        // Keydown and keyup simulation for hotkey field
        hotkeyDisplay.addEventListener('keydown', (e) => {
            if (!isRecordingHotkey) return;
            e.preventDefault();

            if (e.key === 'Escape') {
                isRecordingHotkey = false;
                hotkeyDisplay.classList.remove('recording');
                if (hotkeyText) hotkeyText.textContent = wizardData.hotkey;
                return;
            }

            const parts = [];
            if (e.ctrlKey) parts.push('Ctrl');
            if (e.altKey) parts.push('Alt');
            if (e.shiftKey) parts.push('Shift');
            const mods = new Set(['Control','Alt','Shift','Meta']);
            if (!mods.has(e.key)) {
                parts.push(e.key === ' ' ? 'Space' : e.key.length === 1 ? e.key.toUpperCase() : e.key);
            }

            if (parts.length > 0 && hotkeyText) {
                hotkeyText.textContent = parts.join('+');
            }
        });

        hotkeyDisplay.addEventListener('keyup', (e) => {
            if (!isRecordingHotkey) return;
            e.preventDefault();
            const current = hotkeyText ? hotkeyText.textContent : '';
            if (current && current !== 'Press your shortcut...') {
                wizardData.hotkey = current;
                isRecordingHotkey = false;
                hotkeyDisplay.classList.remove('recording');
                const doneHotkey = wizardWindow.querySelector('#done-hotkey');
                if (doneHotkey) doneHotkey.textContent = current;
            }
        });
    }

    // Step 3: Recording Mode Selection
    const modeOptions = wizardWindow.querySelectorAll('.mode-option');
    modeOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            modeOptions.forEach(b => {
                b.classList.remove('selected');
                b.style.borderColor = 'rgba(255,255,255,0.08)';
                b.style.background = 'rgba(255,255,255,0.02)';
                b.style.color = '#b9cacb';
            });
            btn.classList.add('selected');
            btn.style.borderColor = '';
            btn.style.background = '';
            btn.style.color = '';
            wizardData.recordingMode = btn.dataset.mode;
        });
    });

    // Step 4: Position Option Selection
    const positionOptions = wizardWindow.querySelectorAll('.position-option');
    positionOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            positionOptions.forEach(b => {
                b.classList.remove('selected');
                b.style.borderColor = 'rgba(255,255,255,0.08)';
                b.style.background = 'rgba(255,255,255,0.02)';
                b.style.color = '#b9cacb';
                const pDot = b.querySelector('.position-dot');
                if (pDot) pDot.style.background = '#849495';
                const preview = b.querySelector('.position-preview');
                if (preview) preview.style.borderColor = 'rgba(255,255,255,0.1)';
            });
            btn.classList.add('selected');
            btn.style.borderColor = '';
            btn.style.background = '';
            btn.style.color = '';
            const pDot = btn.querySelector('.position-dot');
            if (pDot) pDot.style.background = '#d18cff';
            const preview = btn.querySelector('.position-preview');
            if (preview) preview.style.borderColor = 'rgba(209,140,255,0.2)';
            wizardData.overlayPosition = btn.dataset.pos;
        });
    });

    // Step 5: Test Setup
    const testRecordBtn = wizardWindow.querySelector('#wiz-test-record-btn');
    const testResult = wizardWindow.querySelector('#wiz-test-result');
    let isTestRecording = false;

    if (testRecordBtn) {
        testRecordBtn.addEventListener('click', () => {
            if (!isTestRecording) {
                isTestRecording = true;
                testRecordBtn.textContent = '⏹ Stop Recording';
                testRecordBtn.style.background = 'linear-gradient(135deg, #ef4444, #c0392b)';
                if (testResult) {
                    testResult.classList.remove('placeholder');
                    testResult.textContent = 'Recording... speak now';
                }
            } else {
                isTestRecording = false;
                testRecordBtn.textContent = '⏳ Transcribing...';
                testRecordBtn.style.background = '';
                testRecordBtn.disabled = true;

                setTimeout(() => {
                    if (testResult) {
                        testResult.textContent = 'Hello! This is a test of Fluence voice typing setup on Windows.';
                    }
                    testRecordBtn.textContent = '🎙 Try Again';
                    testRecordBtn.disabled = false;
                }, 1500);
            }
        });
    }

    // Step 6: Complete Actions
    const openSettingsBtn = wizardWindow.querySelector('#wiz-open-settings-btn');
    const closeBtn = wizardWindow.querySelector('#wiz-close-btn');

    const handleSuccessFinish = () => {
        alert('Setup saved! Fluence configuration successfully complete.');
        updateStep(1);
        // Reset fields
        const keyInput = wizardWindow.querySelector('#wiz-api-key');
        if (keyInput) keyInput.value = '';
        if (testDot) {
            testDot.style.backgroundColor = '#849495';
            testDot.style.boxShadow = 'none';
        }
        if (testText) {
            testText.textContent = 'Not tested';
            testText.style.color = '#b9cacb';
        }
        if (testResult) {
            testResult.classList.add('placeholder');
            testResult.textContent = 'Your transcription will appear here...';
        }
    };

    if (openSettingsBtn) openSettingsBtn.addEventListener('click', handleSuccessFinish);
    if (closeBtn) closeBtn.addEventListener('click', handleSuccessFinish);
}

/* 7. ScrollSpy for Documentation Sidebar */
function initDocsScrollSpy() {
    const docsSections = document.querySelectorAll('.docs-section');
    const docsNavItems = document.querySelectorAll('.docs-nav-item');
    if (docsSections.length === 0 || docsNavItems.length === 0) return;

    function scrollSpy() {
        let currentSectionId = '';
        const scrollThreshold = 140; // Header height + padding

        docsSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= scrollThreshold) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            docsNavItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${currentSectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // run initially
}
