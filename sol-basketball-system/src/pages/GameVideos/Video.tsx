import { db, deleteDoc, doc } from '../../utils/firebase';

interface PropsType {
  video: {
    tag: string;
    date: string;
    title: string;
    youtubeId: string;
  };
  type: string;
  getVideo: () => void;
}

interface VideoType {
  tag: string;
  date: string;
  title: string;
  youtubeId: string;
}

function Video({ video, type, getVideo }: PropsType) {
  const handleDelete = (video: VideoType, type: string, getVideo: () => void) => {
    const userConfirm = confirm('Are you sure you want to delete this video?');
    if (userConfirm) deleteDoc(doc(db, 'videos', 'roadrunners', type, video.youtubeId)).then(() => getVideo());
  };

  return (
    <div className='w-570 border px-2 py-4 shadow-lg'>
      <iframe
        src={`https://www.youtube.com/embed/${video.youtubeId}`}
        title='YouTube video player'
        width='560'
        height='315'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      />
      <div className='flex flex-col'>
        <div className='flex justify-between mt-2 px-2 items-center'>
          <div className='font-bold text-gray-500 tracking-wider'>{video.date}</div>
          <div className='px-2 bg-green-200 rounded-2xl'>{video.tag === 'u10' ? 'U10' : 'U12'}</div>
        </div>
        <div className='flex justify-between mt-2 px-2 items-center'>
          <div className='font-bold'>{video.title}</div>
          <button className='text-gray-400 hover:text-red-500' onClick={() => handleDelete(video, type, getVideo)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Video;
