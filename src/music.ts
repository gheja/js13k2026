"use strict"

function db_to_volume(x) {
    return 10 ** (x / 20)
}

let sounds: Array<any> = []
let music_sample_rate: number

// thanks https://github.com/nicolas-van/sonant-x
// n: halfnote, 128 = A4, 129 = A#4, 130 = B4, ...
// +64 because of the MIDI conversion
function get_note_frequency(n: number) {
    return Math.pow(1.059463094, n - 128 + 64) * 440
}

function render_harmonics(arr: Array<number>, note: number, length: number, attack_time: number, decay_time: number, release_time: number, sustain_volume: number){
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

let _sample_data_cache = {}

function get_sample_data(instrument_index: number, note: number) {
    let cache_key = instrument_index + "," + note

    if (!(cache_key in _sample_data_cache)) {
        if (instrument_index == 0) {
            _sample_data_cache[cache_key] = render_harmonics(HARMONICS_LONG_1, note, 2.8, 0.05, 0.15, 0.5, 0.7)
        }
        else if (instrument_index == 1 {
            _sample_data_cache[cache_key] = render_harmonics(HARMONICS_LONG_2, note, 2.8, 0.05, 0.15, 0.5, 0.7)
        }
        else if (instrument_index == 2) {
            _sample_data_cache[cache_key] = render_harmonics(HARMONICS_LEAD, note, 0.27, 0.01, 0.07, 0.01, 0.4)
        }
/*
        else if (instrument_index == 3) {
            // frequency - but we don't need it here
            // ZZ_KICK[2] = getNoteFrequency(note)
            _sample_data_cache[cache_key] = zzfx(...ZZ_KICK)
        }
        else if (instrument_index == 4) {
            _sample_data_cache[cache_key] = zzfx(...ZZ_SNARE)
        }
*/
    }
    return _sample_data_cache[cache_key]
}

enum MdIdx1 {
    SecondsPerSlot = 0,
    TotalTimeSlots,
    Track,
}

enum Md2Idx {
    InstrumentIndex = 0,
    NoteData,
    NoteTiming,
}

function music_start() {
    let audioCtx = new AudioContext()

    // tracking elapsed time here so we can pause the processing if needed
    // NOTE: start the time a bit earlier to not have a choppy start
    let audio_time = -0.5

    // NOTE: update these to have at least channel count zeroes
    let note_indexes = [0, 0, 0, 0, 0]
    let next_note_times = [0, 0, 0, 0, 0]

    const scriptNode = audioCtx.createScriptProcessor(8192, 1, 1)
    music_sample_rate = scriptNode.context.sampleRate

    // zz_kick[0] = 0.3 * 0.25 // volume
    // zz_kick[2] = getNoteFrequency(music_data[1][n]) * 0.25 // frequency
    // zz_kick[2] = 440

    // sounds.push({ data: zzfx(outputBuffer.sampleRate, ...zz_snare), pos: 0 })
    scriptNode.onaudioprocess = function(audioProcessingEvent) {
        // pause processing when in background
        if (!document.hasFocus()) {
            return
        }

        audio_time += audioProcessingEvent.outputBuffer.duration

        // var inputBuffer = audioProcessingEvent.inputBuffer;
        var outputBuffer = audioProcessingEvent.outputBuffer;

        for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
            // let inputData = inputBuffer.getChannelData(channel)
            let outputData = outputBuffer.getChannelData(channel)

            for (var sample = 0; sample < outputBuffer.length; sample++)
            {
                let now = audio_time + sample / outputBuffer.sampleRate

                for (var j=0; j<MUSIC_DATA[MdIdx1.Track].length; j++) {
                    while (next_note_times[j] <= now)
                    {
                        clog(`starting sound ${j}`)
                        sounds.push({ data: get_sample_data(MUSIC_DATA[MdIdx1.Track][j][Md2Idx.InstrumentIndex], MUSIC_DATA[MdIdx1.Track][j][Md2Idx.NoteData][note_indexes[j]]), pos: 0 })

                        note_indexes[j] = (note_indexes[j] + 1) % MUSIC_DATA[MdIdx1.Track][j][Md2Idx.NoteData].length

                        next_note_times[j] += MUSIC_DATA[MdIdx1.Track][j][Md2Idx.NoteTiming][note_indexes[j]] * MUSIC_DATA[MdIdx1.SecondsPerSlot]
                    }
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
