const songs = [
    {
        title: "Butta Bomma",
        artist: "Armaan Malik",
        cover: "images/buttabomma.png",
        file: "assets/music/Butta_Bomma.mp3",
        duration: "3:18"
    },
    {
        title: "Naatu Naatu",
        artist: "Rahul Sipligunj, Kaala Bhairava",
        cover: "images/Naatu_Naatu.png",
        file: "assets/music/Naatu_Naatu.mp3",
        duration: "3:36"
    },
    {
        title: "Seeti Maar",
        artist: "Jasleen Royal",
        cover: "images/seeti_maar.png",
        file: "assets/music/Seeti_Maar.mp3",
        duration: "3:17"
    },
    {
        title: "Saami Saami",
        artist: "Mounika Yadav",
        cover: "images/saami_saami.png",
        file: "assets/music/Saami_Saami.mp3",
        duration: "3:31"
    },
    {
        title: "Miami",
        artist: "Aditi Singh Sharma",
        cover: "images/miami.png",
        file: "assets/music/Miami.mp3",
        duration: "4:02"
    }
];

const player = {
    audio: new Audio(),
    currentSongIndex: 0,
    isPlaying: false,
    isShuffled: false,
    isRepeated: false,

    init() {
        this.audio.volume = 1;
        this.renderPlaylist();
        this.loadSong(songs[0]);
        
        // Event Listeners
        document.getElementById('play').addEventListener('click', () => this.togglePlay());
        document.getElementById('next').addEventListener('click', () => this.nextSong());
        document.getElementById('prev').addEventListener('click', () => this.prevSong());
        document.getElementById('volume').addEventListener('input', (e) => this.setVolume(e.target.value));
        document.getElementById('shuffle').addEventListener('click', () => this.toggleShuffle());
        document.getElementById('repeat').addEventListener('click', () => this.toggleRepeat());
        document.getElementById('search-input').addEventListener('input', (e) => this.searchSongs(e.target.value));
        document.querySelector('.progress-container').addEventListener('click', (e) => this.seek(e));
        
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
    },

    loadSong(song) {
        this.audio.src = song.file;
        document.getElementById('song-title').textContent = song.title;
        document.getElementById('artist').textContent = song.artist;
        document.getElementById('album-art').src = song.cover;
        document.getElementById('duration').textContent = song.duration;
        this.updatePlaylistStyles();
    },

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
        this.isPlaying = !this.isPlaying;
        document.getElementById('play').innerHTML = this.isPlaying ? 
            '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    },

    nextSong() {
        if (this.isShuffled) {
            this.currentSongIndex = this.getRandomIndex();
        } else {
            this.currentSongIndex = (this.currentSongIndex + 1) % songs.length;
        }
        this.loadSong(songs[this.currentSongIndex]);
        if (this.isPlaying) this.audio.play();
    },

    prevSong() {
        if (this.isShuffled) {
            this.currentSongIndex = this.getRandomIndex();
        } else {
            this.currentSongIndex = (this.currentSongIndex - 1 + songs.length) % songs.length;
        }
        this.loadSong(songs[this.currentSongIndex]);
        if (this.isPlaying) this.audio.play();
    },

    setVolume(volume) {
        this.audio.volume = volume;
        document.getElementById('volume').value = volume;
    },

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        document.getElementById('shuffle').classList.toggle('active', this.isShuffled);
    },

    toggleRepeat() {
        this.isRepeated = !this.isRepeated;
        document.getElementById('repeat').classList.toggle('active', this.isRepeated);
        
        if (this.isRepeated) {
            this.audio.currentTime = 0;
            this.audio.play();
        }
    },
    
    handleSongEnd() {
        if (this.isRepeated) {
            this.audio.currentTime = 0; 
            this.audio.play(); 
        } else {
            this.nextSong(); 
        }
    },
    

    updateProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
        document.getElementById('current-time').textContent = 
            this.formatTime(this.audio.currentTime);
    },

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },

    handleSongEnd() {
        if (this.isRepeated) {
            this.audio.currentTime = 0; 
            this.audio.play(); 
        } else {
            this.nextSong(); 
        }
    },

    seek(e) {
        const width = e.target.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        this.audio.currentTime = (clickX / width) * duration;
    },

    renderPlaylist() {
        const playlist = document.getElementById('playlist');
        playlist.innerHTML = songs.map((song, index) => `
            <li class="${index === 0 ? 'playing' : ''}" data-index="${index}">
                <span class="play-icon"><i class="fas fa-music"></i></span>
                <div class="song-details">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
                <span class="duration">${song.duration}</span>
            </li>
        `).join('');

        playlist.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', () => {
                this.currentSongIndex = parseInt(item.dataset.index);
                this.loadSong(songs[this.currentSongIndex]);
                if (this.isPlaying) this.audio.play();
            });
        });
    },

    updatePlaylistStyles() {
        document.querySelectorAll('#playlist li').forEach(li => {
            li.classList.remove('playing');
        });
        document.querySelector(`#playlist li[data-index="${this.currentSongIndex}"]`)
            .classList.add('playing');
    },

    searchSongs(query) {
        const filtered = songs.filter(song => 
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase())
        );
        this.renderFilteredPlaylist(filtered);
    },

    renderFilteredPlaylist(filteredSongs) {
        const playlist = document.getElementById('playlist');
        playlist.innerHTML = filteredSongs.map(song => `
            <li data-index="${songs.indexOf(song)}">
                <span class="play-icon"><i class="fas fa-music"></i></span>
                <div class="song-details">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
                <span class="duration">${song.duration}</span>
            </li>
        `).join('');
    },

    getRandomIndex() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === this.currentSongIndex);
        return newIndex;
    }
};


player.init();


document.getElementById('repeat').addEventListener('click', () => {
    if (player.isRepeated) {
        player.audio.currentTime = 0; 
        player.audio.play(); 
    } else {
        player.toggleRepeat();
    }
});
