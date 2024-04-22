import { useEffect, useState } from "preact/hooks";
import TimeSelector from "./TimeSelector";
import { MaxSize, storageKey, TextRegex, timeZones } from "@utils/constants";
import PlusIconSvg from "@static/svgComponents/PlusIconSvg";
import "@styles/popup.css";
import MinusIconSvg from "@static/svgComponents/MinusIconSvg";
import { ParseStateArray, StateArray, StateItem } from "@types/popup";
import { getStorage } from "@utils/helpers";

const Popup = () => {
  const defaultError = {
    prefixError: {
      hasTouched: false,
      error: "",
    },
    zoneError: { hasTouched: false, error: "" },
  };
  const defaultValue: StateItem = {
    prefix: "",
    zone: "",
    errors: defaultError,
  };

  const [value, setValue] = useState<StateArray>([defaultValue]);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  console.log("values",value)
  useEffect(() => {
    chrome.storage.sync.get([storageKey]).then((result: any) => {
      const data = result[storageKey];
      if(data && data.length){
        const newData = data.map((item:any)=>{
          return {
            ...item,
            errors:{
              prefixError:{
                ...defaultError.prefixError,
                hasTouched: true
              },
              zoneError:{
                ...defaultError.zoneError,
                hasTouched: true
              }
            }
          }
        })
        setValue(newData)
      }
    });
  }, []);

  const handleValue = (index: number, obj: any) => {
    const newVal: StateArray = [...value];
    let newObj: StateItem = { ...obj };
    if (newObj.errors?.prefixError?.hasTouched) {
      if (!TextRegex.test(newObj.prefix)) {
        newObj = {
          ...newObj,
          errors: {
            ...newObj.errors,
            prefixError: {
              hasTouched: false,
              error: "Invalid! Must be 2-5 alphabets.",
            },
          },
        };
      }
    }
    if (newObj.errors?.zoneError?.hasTouched) {
      if (!newObj.zone) {
        newObj = {
          ...newObj,
          errors: {
            ...newObj.errors,
            zoneError: {
              hasTouched: false,
              error: "Invalid! Cannot be empty",
            },
          },
        };
      }
    }

    newVal[index] = newObj;
    setValue(newVal);
  };

  const handleBeforeSubmit = (data: StateArray): boolean => {
    let hasError = false;
    const updatedData = data.map((item: StateItem) => {
      if (!item?.errors?.prefixError?.hasTouched) {
        hasError = true;
        item.errors.prefixError.error = "Invalid! Cannot be empty";
      }
      if (!item?.errors?.zoneError?.hasTouched) {
        hasError = true;
        const findZone = timeZones.find((list: string) => list === item?.zone);
        item.errors.zoneError.error = item?.zone && findZone ? "Invalid! Time zone": "Invalid! Cannot be empty";
      }
      return item;
    });
    setValue(updatedData);
    return hasError;
  };


  const handleSubmit = () => {
    const hasError: boolean = handleBeforeSubmit(value);
    if (!hasError) {
      let timer:any = null;
      setSubmitting(true);
      const zoneData = value.reduce((acc: ParseStateArray, curr: StateItem) => {
        const newAcc: any = [...acc];
        newAcc.push({
          prefix: curr.prefix,
          zone: curr.zone,
        });
        return newAcc;
      }, []);

      chrome.storage.sync.set({ [storageKey]: zoneData }).then(() => {
        console.log("Data successfully updated");
        timer = setTimeout(()=>{
          setSubmitting(false);
        }, 2000)
      }).catch(err=>{
        clearInterval(timer);
        setSubmitting(false);

      })
    }
  };

  return (
    <div className="popup">
      <div className="popup_headings grid">
        <h2>syntax</h2>
        <h2>Time-Zone</h2>
      </div>
      {value.map((obj, index) => (
        <div className="popup_container">
          <TimeSelector value={obj} index={index} handleValue={handleValue} />
          {index != 0 ? (
            <MinusIconSvg
              className="popup_minus_icon"
              onClick={() => {
                const newValue = [...value];
                newValue.splice(index, 1);
                setValue(newValue);
              }}
            />
          ) : (
            <></>
          )}
        </div>
      ))}
      {value.length < MaxSize ? (
        <div className="popup_plus">
          <PlusIconSvg
            onClick={() => {
              const newValue = [...value];
              newValue.push(defaultValue);
              setValue(newValue);
            }}
          />
        </div>
      ) : (
        <></>
      )}
      <button
        onClick={() => {
          if (!isSubmitting) {
            handleSubmit();
          }
        }}
        className="popup_button"
      >
        {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
      </button>
    </div>
  );
};

export default Popup;
