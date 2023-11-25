interface PropsType {
  game: {
    tag: string;
    date: string;
    title: string;
    link: string;
  };
}

function Video({ game }: PropsType) {
  return (
    <div className='w-[560px]'>
      <iframe
        src={`https://www.youtube.com/embed/${game.link}`}
        title='YouTube video player'
        width='560'
        height='315'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      />
      <div className='flex flex-col'>
        <div className='flex justify-between'>
          <div>{game.date}</div>
          <div>{game.tag}</div>
        </div>
        <div>{game.title}</div>
      </div>
    </div>
  );
}

export default Video;
