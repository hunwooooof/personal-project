function Terms() {
  const terms = [
    {
      title: '內容使用權',
      description:
        '本網站上的所有內容（包括但不限於文字、圖像、視頻等）是我們的財產，受到相應的知識產權法律保護。未經我們許可，您不得複製、修改、分發或以任何形式使用這些內容。',
    },
    {
      title: '用戶行為',
      description:
        '在使用本網站時，您同意不從事違法、侵犯他人權益、妨礙網站運行的行為。我們保留隨時終止或限制您訪問本網站的權利。',
    },
    {
      title: '連結至第三方網站',
      description:
        '本網站可能包含指向第三方網站的連結。這些連結僅供方便參考，我們不對這些網站的內容負責。請仔細閱讀第三方網站的使用條款和隱私政策。',
    },
  ];
  return (
    <div className='pt-16 sm:pt-20 min-h-[calc(100vh-550px)]'>
      <div className='p-20'>
        <h2 className='text-3xl font-bold mb-10'>服務條款 ｜ Terms of Service</h2>
        <div className='mb-10 text-lg'>
          歡迎使用 Sol Basketball
          網站（以下簡稱"我們"）。請仔細閱讀以下使用條款，使用本網站即表示您同意這些條款。如果您不同意這些條款，請停止使用本網站。
        </div>
        <div>
          {terms.map((term, i) => {
            return (
              <div className='flex gap-4 mb-4' key={i}>
                <div className='w-40 whitespace-nowrap text-gray-500'>{term.title}</div>
                <div className='w-full font-medium'>{term.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Terms;
