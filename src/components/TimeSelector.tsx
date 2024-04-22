import { useState, useEffect, useRef } from "preact/hooks";
import { timeZones } from "@utils/constants";
import "@styles/popup.css";
import { StateItem } from "@types/popup";

interface TimeSelectorProps {
  value: StateItem;
  handleValue: (index: number, obj: StateItem) => void;
  index: number;
}

const TimeSelector = ({ value, handleValue, index }: TimeSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState(value?.zone);
  console.log("searchTerm", searchTerm);
  const [show, setShow] = useState(false);
  const selectBox = useRef(null);
  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (selectBox.current && !selectBox.current.contains(event.target)) {
  //       setShow(false);
  //     }
  //   }

  //   // Bind the event listener
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     // Unbind the event listener on clean up
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [selectBox]);

  useEffect(() => {
    setSearchTerm(value?.zone);
  }, [value]);

  const handleInputOnBlur = (e: any) => {
    const zone: string = e.target.value;

    if (!zone) {
      handleValue(index, {
        ...value,
        zone: zone,
        errors: {
          ...value.errors,
          zoneError: {
            hasTouched: true,
            error: "",
          },
        },
      });
    }
  };

  const filteredTimeZone = timeZones.filter((zone) =>
    zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="popup_box grid">
      <div className="popup_box_input">
        <input
          type="text"
          value={value.prefix}
          onBlur={(e: any) => {
            handleValue(index, {
              ...value,
              prefix: e.target.value,
              errors: {
                ...value.errors,
                prefixError: {
                  hasTouched: true,
                  error: "",
                },
              },
            });
          }}
        />
        {value.errors?.prefixError ? (
          <TimeSelector.Error error={value.errors?.prefixError?.error} />
        ) : (
          <></>
        )}
      </div>
      <div ref={selectBox} className="popup_box_select">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onFocus={() => {
            setShow(true);
          }}
          onBlur={(e: any) => {
            handleInputOnBlur(e);
          }}
          onInput={(e: any) => {
            setSearchTerm(e.target.value);
          }}
        />
        <ul>
          {show ? (
            filteredTimeZone.length ? (
              filteredTimeZone?.map((item) => (
                <li
                  key={item}
                  onClick={() => {
                    setSearchTerm(item);
                    setShow(false);
                    handleValue(index, {
                      ...value,
                      zone: item,
                      errors: {
                        ...value.errors,
                        zoneError: {
                          hasTouched: true,
                          error: "",
                        },
                      },
                    });
                  }}
                >
                  {item}
                </li>
              ))
            ) : (
              <>Not Found</>
            )
          ) : (
            <></>
          )}
        </ul>
        {value.errors?.zoneError ? (
          <TimeSelector.Error error={value.errors?.zoneError?.error} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

TimeSelector.Error = function ({ error }: { error: string }) {
  return <div className="error">{error}</div>;
};

export default TimeSelector;
