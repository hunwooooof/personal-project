import { VideoType } from '../../utils/types';
import Video from './Video';

interface PropsType {
  filteredVideos: VideoType[];
  type: string;
}
function VideoList({ filteredVideos, type }: PropsType) {
  return (
    <>
      {filteredVideos.map((video) => {
        return <Video key={video.youtubeId} video={video} type={type} />;
      })}
      {filteredVideos.length === 0 && (
        <div className='w-full text-center text-gray-600 text-2xl'>Currently no videos available</div>
      )}
    </>
  );
}

export default VideoList;
