import { useState } from "preact/hooks";
import TimeSelector from "./TimeSelector";
import { storageKey } from "@utils/constants";
import "@styles/popup.css"
const Popup = () => {
  const [value, setValue] = useState([
    { prefix: "", zone: "", errors: { prefixError: "", zoneError: "" } },
    { prefix: "", zone: "", errors: { prefixError: "", zoneError: "" } },
    { prefix: "", zone: "", errors: { prefixError: "", zoneError: "" } },
  ]);

  const handleValue = (index:number, obj:any) => {
    const newVal = [...value];
    // const newObj = { ...obj };
    // if (!regex.test(obj.prefix)) {
    //   newObj = {
    //     ...obj,
    //     errors: {
    //       ...obj.errors,
    //       prefixError: "Invalid! Must be 2-5 alphabets.",
    //     },
    //   };
    // }
    newVal[index] = obj;
    setValue(newVal);
  };

  const handleSubmit = () =>{
    const zoneData = value.reduce((acc,curr)=>{
      const newAcc = [...acc];
      newAcc.push({
        prefix: curr.prefix,
        zone: curr.zone,
      })
      return newAcc

    },[])
    chrome.storage.local.set({ storageKey: zoneData }).then(() => {
      console.log("Value is set");
    });
    
  }
  return (
    <div className="popup">
      <div className="popup_headings grid">
        <h2>syntax</h2>
        <h2>Time-Zone</h2>
      </div>
      {value.map((obj, index) => (
        <TimeSelector value={obj} index={index} handleValue={handleValue} />
      ))}
      <button onSubmit={handleSubmit} className="popup_button">SUBMIT</button>
    </div>
  );
};

export default Popup;
