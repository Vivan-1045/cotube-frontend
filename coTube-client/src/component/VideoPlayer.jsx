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
  }

  const onStateChange = (event) =>{

    if(ignoreNextEvent.current){
      ignoreNextEvent.current = false;
      return;
    }

     switch(event.data){
      case 1:
        onPlay?.(playerRef.current);
        break;
      case 2:
        onPause?.(playerRef.current);
        break;
      default:
        break;
     }
  }

  if(!videoId) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#050914] text-sm text-slate-500">
        No video selected
      </div>
    );
  }

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-black">
      <YouTube
        videoId={videoId}
        onReady={onReady}
        onStateChange={onStateChange}
        className="h-full w-full"
        iframeClassName="h-full w-full"
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 0,
            rel: 0,
            modestbranding: 1,
          },
        }}
      />
    </div>
  );
}