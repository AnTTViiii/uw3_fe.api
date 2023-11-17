import React from 'react'
import { Link } from 'react-router-dom';
import "../styles/Footer.css"
function Footer() {
  const thisYear = new Date().getFullYear();
  return (
    <div className='footerContainer'>
      <div className='f-left'>&#169; {thisYear === 2023 ? 2023 : '2023 - ' + thisYear} UW3 mStream</div>
      <div className='f-right'>
        <Link target='_blank' to={`https://github.com/AnTTViiii/uw3_mstream`}>Github</Link>&nbsp;|&nbsp;
        <Link target='_blank' to={`https://uithcm-my.sharepoint.com/:w:/g/personal/20520825_ms_uit_edu_vn/EXI-baP8xz9MqtSzYL99iMwBEggSVM28LGzFjJCnq4Opig?e=Cmx7CB&fbclid=IwAR1WyfPD141UcsNBM1AzskW0PH5gXHnTTMGERENFXJ_JzVm9pPcZzqa_-YA`}>Report</Link>&nbsp;|&nbsp;
        <Link target='_blank' to={`https://uithcm-my.sharepoint.com/:p:/g/personal/20520825_ms_uit_edu_vn/EbQZo2ohTx9DmZD5w1Ynz6kBv2PATUGi2seRG7Lle66CIQ?e=ohS8Gp&fbclid=IwAR0AOiV7t8n-eNdcNJs_UPLHNx0vK65mrHaycLRQ4_S-usWDtRzwLl-E9Hk`}>Slide</Link>
      </div>
    </div>
  )
}

export default Footer
