import { useState, useEffect, useRef } from "preact/hooks";
import { timeZones } from "@utils/constants";
import "@styles/popup.css"

const TimeSelector = ({ value, handleValue, index }) => {
    const [searchTerm, setSearchTerm] = useState(value?.zone);
    const [show, setShow] = useState(false);
    const selectBox = useRef(null);
    console.log("searchTerm",searchTerm)

    useEffect(() => {
        function handleClickOutside(event) {
          if (selectBox.current && !selectBox.current.contains(event.target)) {
            setShow(false);
          }
        }
    
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [selectBox]);

  return (
    <div className="popup_box grid">
      <div className="popup_box_input">
        <input
          type="text"
          value={value.prefix}
          onChange={(e) => {
            handleValue(index, {
              zone: searchTerm,
              prefix: e.target.value,
            });
          }}
        />
        {value.errors?.prefixError ? (
          <TimeSelector.Error error={value.errors?.prefixError} />
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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
          {show &&
            timeZones
              .filter((zone) =>
                zone.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              ?.map((item) => (
                <li
                  key={item}
                  onClick={() => {
                    setSearchTerm(item);
                    setShow(false);
                    handleValue(index, {
                      zone: item,
                      prefix: value.prefix,
                    });
                  }}
                >
                  {item}
                </li>
              ))}
        </ul>
        {value.errors?.zoneError ? (
          <TimeSelector.Error error={value.errors?.zoneError} />
        ) : (
          <></>
        )}
        {/* <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          {filteredOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select> */}
      </div>
    </div>
  )
}

TimeSelector.Error = function({ error }){
    return <div className="error">{error}</div>;
  };

export default TimeSelector