var _CANVAS = document.querySelector("#video-canvas"),
  _CTX = _CANVAS.getContext("2d"),
  _VIDEO = document.querySelector("#main-video");

// Upon click this should should trigger click on the #file-to-upload file input element
// This is better than showing the not-good-looking file input element
document.querySelector("#upload-button").addEventListener('click', function() {
  document.querySelector("#file-to-upload").click();
});

// When user chooses a MP4 file
document.querySelector("#file-to-upload").addEventListener('change', function() {
  // Validate whether MP4
  if (['video/mp4'].indexOf(document.querySelector("#file-to-upload").files[0].type) == -1) {
    alert('Error : Only MP4 format allowed');
    return;
  }

  // Hide upload button
  document.querySelector("#upload-button").style.display = 'none';

  // Object Url as the video source
  document.querySelector("#main-video source").setAttribute('src', URL.createObjectURL(document.querySelector("#file-to-upload").files[0]));

  // Load the video and show it
  _VIDEO.load();
  _VIDEO.style.display = 'inline';

  // Load metadata of the video to get video duration and dimensions
  _VIDEO.addEventListener('loadedmetadata', function() {
    console.log(_VIDEO.duration);
    var video_duration = _VIDEO.duration,
      duration_options_html = '';

    // Set options in dropdown at 4 second interval
    for (var i = 0; i < Math.floor(video_duration); i = i + 4) {
      duration_options_html += '<option value="' + i + '">' + i + '</option>';
    }
    document.querySelector("#set-video-seconds").innerHTML = duration_options_html;

    // Show the dropdown container
    document.querySelector("#thumbnail-container").style.display = 'block';

    // Set canvas dimensions same as video dimensions
    _CANVAS.width = _VIDEO.videoWidth;
    _CANVAS.height = _VIDEO.videoHeight;
  });
});

// On changing the duration dropdown, seek the video to that duration
document.querySelector("#set-video-seconds").addEventListener('change', function() {
  _VIDEO.currentTime = document.querySelector("#set-video-seconds").value;

  // Seeking might take a few milliseconds, so disable the dropdown and hide download link 
  document.querySelector("#set-video-seconds").disabled = true;
  document.querySelector("#get-thumbnail").style.display = 'none';
});

// Seeking video to the specified duration is complete 
document.querySelector("#main-video").addEventListener('timeupdate', function() {
  // Re-enable the dropdown and show the Download link
  document.querySelector("#set-video-seconds").disabled = false;
  document.querySelector("#get-thumbnail").style.display = 'inline';
});

// On clicking the Download button set the video in the canvas and download the base-64 encoded image data
document.querySelector("#get-thumbnail").addEventListener('click', function() {
  _CTX.drawImage(_VIDEO, 0, 0, _VIDEO.videoWidth, _VIDEO.videoHeight);

  document.querySelector("#get-thumbnail").setAttribute('href', _CANVAS.toDataURL());
  document.querySelector("#get-thumbnail").setAttribute('download', 'thumbnail.png');
});