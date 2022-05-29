const sdk = require("api")("@tron/v4.4.2#39lxa3hl0qj5m48");
 

function sendNotifcationForBalance(address) {
    sdk["get-account-info-by-address"]({ address: address })
      .then((res) => {
        const { balance } = res.data[0];
        const message = `<b> Balance</b>: <b>${balance}</b>`;
        getStoredUsers(message);
      })
      .catch((err) => console.error(err));
  }
  
  function sendNotifcationForTransctionDetails(address) {
    sdk["get-transaction-info-by-account-address"]({ address: address })
      .then((res) => {
        const { data } = res;
  
        let message = "";
        data.forEach((el) => {
          message += `<pre><b> txID</b>: <b>${el.txID}</b> 
              <b> NetFee</b>: <b>${el.net_fee}</b>  
             <b> To</b>: <b>${el.raw_data.contract[0].parameter.value.to_address}</b>
             <b> From</b>: <b>${el.raw_data.contract[0].parameter.value.owner_address}</b>
             <b> Amount</b>: <b>${el.raw_data.contract[0].parameter.value.amount}</b> </pre> \n
             `;
        });
  
        getStoredUsers(message);
      })
      .catch((err) => console.error(err));
  }

  module.exports = {sendNotifcationForBalance,sendNotifcationForTransctionDetails  };