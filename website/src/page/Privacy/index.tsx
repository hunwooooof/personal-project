function Privacy() {
  const privacies = [
    {
      title: '收集的信息',
      description: '我們可能收集您在網站上提供的個人信息，包括但不限於姓名、電子郵件地址、聯絡方式等。',
    },
    {
      title: '信息用途',
      description: '我們使用收集的信息來回應您的查詢、提供服務、向您發送相關信息以及改善網站內容和功能。',
    },
    {
      title: '信息保護',
      description: '我們採取適當的安全措施來保護您的個人信息，並僅允許授權人員訪問。',
    },
    {
      title: '第三方分享',
      description:
        '我們不會將您的個人信息出售、交換或租賃給第三方。在某些情況下，我們可能與合作夥伴共享信息，以提供更好的服務。',
    },
    {
      title: 'Cookie 使用',
      description: '我們使用 cookie 技術來提高網站的運行效能並提供更好的使用體驗。您可以通過瀏覽器設定拒絕 cookie。',
    },
  ];
  return (
    <div className='pt-16 sm:pt-20 min-h-[calc(100vh-550px)]]'>
      <div className='p-20'>
        <h2 className='text-3xl font-bold mb-10'>隱私權政策 ｜ Privacy Policy</h2>
        <div className='mb-10 text-lg'>
          我們非常重視您的隱私權。這份隱私權政策說明了我們收集、使用和保護您的個人信息的方式。
        </div>
        <div>
          {privacies.map((privacy, i) => {
            return (
              <div className='flex gap-4 mb-4' key={i}>
                <div className='w-28 text-gray-500'>{privacy.title}</div>
                <div className='w-full font-medium'>{privacy.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Privacy;
