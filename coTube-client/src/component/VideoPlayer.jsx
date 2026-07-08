import YouTube from "react-youtube";
import { useRef , useEffect} from "react";

export default function VideoPlayer({ videoId ,onPlay, onPause,remoteAction}) {

  const playerRef = useRef(null);
  const ignoreNextEvent = useRef(false);


  useEffect(()=>{
    if(!remoteAction || !playerRef.current) return;
    switch (remoteAction.action){
      case "PLAY":
        ignoreNextEvent.current = true;
        playerRef.current.seekTo(remoteAction.currentTime,true);
        playerRef.current.playVideo();
        break;

      case "PAUSE":
        ignoreNextEvent.current = true;
        playerRef.current.seekTo(remoteAction.currentTime,true);
        playerRef.current.pauseVideo();
        break;

      case "SEEK":
        ignoreNextEvent.current = true;
        playerRef.current.seekTo(remoteAction.currentTime,true);
        break;
      
      default:
        break;
      
    }
  },[remoteAction]);

  const onReady = (event) =>{
    playerRef.current = event.target;
    console.log("Player is ready.");
  }

  const onStateChange = (event) =>{

    if(ignoreNextEvent.current){
      ignoreNextEvent.current = false;
      return;
    }

     switch(event.data){
      case 1:
        console.log("PLAY");
        onPlay?.(playerRef.current);
        break;
      case 2:
        console.log("PAUSE");
        onPause?.(playerRef.current);
        break;
      default:
        break;
     }
  }

  if (!videoId) {
    return (
      <div className="border rounded p-6 text-center">
        No video selected
      </div>
    );
  }

  return (
    <YouTube
      videoId={videoId}
      onReady={onReady}
      onStateChange={onStateChange}
      opts={{
        width: "100%",
        height: "500",
        playerVars: {
          autoplay:0,
        },
      }}
    />
  );
}