import { ParseItemState, ParseStateArray, storageItemState, storageItemStateArray } from "@types/popup";
import { modalConfig, storageKey, TimeRegex, TimeRemoveRegex } from "@utils/constants";
import { convertTimeToTargetZone, findContentTag ,isValidTag, getPositionOfWord} from "@utils/helpers";

const bodyTag: any = document.getElementsByTagName("body") || null;
const bodyTagName: any = bodyTag && bodyTag[0];
chrome.storage.sync.get([storageKey]).then((result: any) => {
  bodyTagName && bodyTagName.addEventListener("mouseup", ()=>{
    onMouseUp(result[storageKey])
  }, false);
})
let isModalOpen = false;

function onMouseUp(timeZones:storageItemStateArray) {
  const activeTextarea: any = document.activeElement;
  
  console.log("timely-result",timeZones)
  const selectedTag = activeTextarea.tagName;

  if (isValidTag(activeTextarea)) {
     addingDivTag(activeTextarea);
     
    activeTextarea.addEventListener("input", (input: any) => {
      const value: string = selectedTag == "INPUT" && selectedTag == "TEXTAREA"  ?  input.target.value : input.target.textContent;
      const splitTarget: Array<string> = value.split("$");
      const targetValue: string = splitTarget[splitTarget.length - 1];
      if (TimeRegex.test(targetValue)) {
        const totalLength:number = targetValue.length
        const time: string = targetValue.substring(totalLength-5, totalLength);
        const prefix: string = targetValue.substring(0, totalLength-5);
        const timeState:storageItemState | undefined = timeZones.find((item:storageItemState)=> item?.prefix === prefix)
        if(timeState?.zone){
          const convertedTime = convertTimeToTargetZone(time, timeState?.zone);
          addingHtmlToDivTag(activeTextarea, convertedTime, time, targetValue);
        }
      } else if (isModalOpen) {
        removeHtmlDivTag(activeTextarea);
      }
    });
  }
}

function addingDivTag(activeTextarea: HTMLElement) {
  const parentTag: HTMLElement = activeTextarea.parentElement;
  parentTag.style.position = "relative";

  const divTag = Array.from(parentTag.children).find(
    (tag: any) => tag.id === "tl-content"
  );
  if (!divTag) {
    const extDiv = document.createElement("div");
    extDiv.id = "tl-content";
    extDiv.style.position = 'relative';
    parentTag.appendChild(extDiv);
  }
}

function addingHtmlToDivTag(
  activeTextarea: HTMLElement,
  timeArr: string[],
  timeString: string,
  targetValue: string
) {
  const parentTag: HTMLElement = activeTextarea.parentElement;
  const contentTag: any = findContentTag(activeTextarea);
  const value:string = contentTag.tagName == "INPUT" && contentTag.tagName == "TEXTAREA" ? contentTag.value : contentTag.textContent
  const parentBoundary: { top: number; left: number } =
    // parentTag.getBoundingClientRect();
    getPositionOfWord(value, targetValue, contentTag)
  const height = parentBoundary.top - modalConfig.height;
  const divTag = Array.from(parentTag.children).find(
    (tag: any) => tag.id === "tl-content"
  );
  if (divTag) {
    divTag.innerHTML = `<div id="tl-content-child" style="top:${height}px; left:${
      parentBoundary.left
    }px" class="tl-main">
    ${timeArr
      .map(
        (time) =>
          `<div class="tl-child"><span>${timeString} </span>-> ${time}</div>`
      )
      .join("")}
  </div>`;
  timeArr.forEach((time: string,index:number) => {
    const timeSlot = divTag.children[index];
    if (timeSlot) {
      timeSlot.addEventListener("click", () => {
        handleTimeSlotClick(time,targetValue, activeTextarea);
      });
    }
  });
    isModalOpen = true;
  }
}

function handleTimeSlotClick(
  time: string,
  targetValue: string,
  activeTextarea: HTMLElement
) {
  const contentTag: any = findContentTag(activeTextarea);
  const selectedTag = contentTag.tagName;
  if(selectedTag == "INPUT" || selectedTag == "TEXTAREA") {
    contentTag.value = contentTag.value.replace(`$${targetValue}`, time);
  }else{
    contentTag.textContent = contentTag.textContent.replace(`$${targetValue}`, time);
  }
  removeHtmlDivTag(activeTextarea)
}

function removeHtmlDivTag(activeTextarea: HTMLElement) {
  const parentTag: HTMLElement = activeTextarea.parentElement;
  const divTag: any = Array.from(parentTag.children).find(
    (tag: any) => tag.id === "tl-content"
  );
  if (divTag) {
    divTag.children[0].remove();
    isModalOpen = false;
  }
}
