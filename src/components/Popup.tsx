import { useState } from "preact/hooks";
import TimeSelector from "./TimeSelector";
import { storageKey, TextRegex } from "@utils/constants";
import "@styles/popup.css"
interface StateItem {
  prefix: string;
  zone: string;
  errors: {
    prefixError: string;
    zoneError: string;
  };
}

interface ParseItemState{
  prefix: string;
  zone: string;
}

interface ParseStateArray extends Array<ParseItemState> {}


interface StateArray extends Array<StateItem> {}

const Popup = () => {
  const [value, setValue] = useState<StateArray>([
    { prefix: "", zone: "", errors: { prefixError: "", zoneError: "" } },
    { prefix: "", zone: "", errors: { prefixError: "", zoneError: "" } },
    { prefix: "", zone: "", errors: { prefixError: "", zoneError: "" } },
  ]);

  console.log(value)

  const handleValue = (index:number, obj:any) => {
    const newVal: StateArray = [...value];
    let newObj:StateItem = { ...obj };
    if (!TextRegex.test(newObj.prefix)) {
      newObj = {
        ...newObj,
        errors: {
          ...newObj.errors,
          prefixError: "Invalid! Must be 2-5 alphabets.",
        },
      };
    }
    if(!newObj.zone){
      newObj = {
        ...newObj,
        errors: {
          ...newObj.errors,
          zoneError: "Invalid! Cannot be empty",
        },
      };
    }
    newVal[index] = newObj;
    setValue(newVal);
  };

  const handleSubmit = () =>{
    const zoneData = value.reduce((acc:ParseStateArray,curr:StateItem)=>{
      const newAcc = [...acc];
      newAcc.push({
        prefix: curr.prefix,
        zone: curr.zone,
      })
      return newAcc

    },[])
    console.log(zoneData);
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
      <button onClick={handleSubmit} className="popup_button">SUBMIT</button>
    </div>
  );
};

export default Popup;
