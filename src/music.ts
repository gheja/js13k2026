"use strict"

function db_to_volume(x) {
    return 10 ** (x / 20)
}


let sounds = []
let music_sample_rate

let zz_snare = [.6,0,130,.01,,.19,,,,,,,,50,,,,.6]
let zz_kick = [2,0,20,.001,,.28,,,-0.1,,,,,1,,,,.2,.11]


// thanks https://github.com/nicolas-van/sonant-x
// n: halfnote, 128 = A4, 129 = A#4, 130 = B4, ...
// +64 because of the MIDI conversion
function get_note_frequency(n) {
    return Math.pow(1.059463094, n - 128 + 64) * 440
}

function render_harmonics(arr, note, length, attack_time, decay_time, release_time, sustain_volume){
    let length_s = music_sample_rate * length
    let data = new Array(length_s).fill(0)

    // sample count for the ADSR envelope
    let attack_s = Math.floor(attack_time * music_sample_rate)
    let decay_s = Math.floor(decay_time * music_sample_rate)
    let release_s = Math.floor(release_time * music_sample_rate)
    let sustain_s = length_s - attack_s - decay_s - release_s

    // multiplier for the frequenceis
    let r = get_note_frequency(note) / 440

    for (let j=0; j<arr.length; j+=2) {
        // arr[j]: frequency
        // arr[j+1]: volume

        let vol = db_to_volume(arr[j+1])

        for (let i=0; i<length_s; i++) {
            // apply the ADSR envelope to the volume
            // thanks Frank! -- https://github.com/KilledByAPixel/ZzFX/blob/master/ZzFXMicro.js
            let vol2 = vol *
                (i < attack_s ? i/attack_s :                  // attack
                i < attack_s + decay_s ?                      // decay
                1-((i-attack_s)/decay_s)*(1-sustain_volume) : // decay falloff
                i < attack_s + decay_s + sustain_s ?          // sustain
                sustain_volume :                              // sustain volume
                i < length_s ?                                // release
                (length_s - i)/release_s *                    // release falloff
                sustain_volume :                              // release volume
                0)                                            // post release

            data[i] += Math.sin(2 * PI * (arr[j] * r) * (i / music_sample_rate)) * vol2
        }
    }

    return data
}

function music_start() {
    let audioCtx = new AudioContext()
    let nextNoteTime = 0
    let n = 0

    const scriptNode = audioCtx.createScriptProcessor(4096 * 2 * 2, 1, 1)
    music_sample_rate = scriptNode.context.sampleRate

    // zz_kick[0] = 0.3 * 0.25 // volume
    // zz_kick[2] = getNoteFrequency(music_data[1][n]) * 0.25 // frequency
    // zz_kick[2] = 440

    // sounds.push({ data: zzfx(outputBuffer.sampleRate, ...zz_snare), pos: 0 })
    scriptNode.onaudioprocess = function(audioProcessingEvent) {
        // var inputBuffer = audioProcessingEvent.inputBuffer;
        var outputBuffer = audioProcessingEvent.outputBuffer;

        for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
            // let inputData = inputBuffer.getChannelData(channel)
            let outputData = outputBuffer.getChannelData(channel)

            for (var sample = 0; sample < outputBuffer.length; sample++)
            {
                // -0.5 is just to fill the first half a second with zero
                let now = audioProcessingEvent.playbackTime + sample / outputBuffer.sampleRate - 0.5

                while (nextNoteTime <= now)
                {
                    // zz3[0] = 0.7 * 0.25
                    // zz3[2] = getNoteFrequency(music_data[1][n]) * 1.0
                    // sounds.push({ data: zzfx(outputBuffer.sampleRate, ...zz3), pos: 0 })

                    // sounds.push({ data: render_harmonics(HARMONICS_LEAD, music_data[1][n], 0.27, 0.01, 0.07, 0.01, 0.4), pos: 0 })
                    // sounds.push({ data: render_harmonics(HARMONICS_LONG_2, music_data[1][n], 2.8, 0.05, 0.15, 0.5, 0.7), pos: 0 })
                    sounds.push({ data: render_harmonics(HARMONICS_LONG_1, MUSIC_DATA[1][n], 2.8, 0.05, 0.15, 0.5, 0.7), pos: 0 })

                    n = (n + 1) % MUSIC_DATA[1].length

                    nextNoteTime += MUSIC_DATA[2][n] * 4 * MUSIC_DATA[0]
                }

                for (var i=sounds.length-1; i>=0; i--)
                {
                    if (sounds[i].pos < sounds[i].data.length)
                    {
                        outputData[sample] += sounds[i].data[sounds[i].pos++]
                    }
                }
            }
        }

        // clean up the finished sounds
        for (var i=sounds.length-1; i>=0; i--)
        {
            if (sounds[i].pos == sounds[i].data.length)
            {
                sounds.splice(i, 1)
            }
        }
    }

    // start audio processing
    scriptNode.connect(audioCtx.destination)
}

// function play_sound() {
//     sounds.push({ data: zzfx(music_sample_rate, ...zz_temp), pos: 0 })
// }

function music_start_if_needed() {
    if (!music_sample_rate) {
        music_start()
    }
}
