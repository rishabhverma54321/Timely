import { modalConfig, TimeRegex, TimeRemoveRegex } from "@utils/constants";
import { convertTimeToTargetZone, findContentTag ,isValidTag, getPositionOfWord} from "@utils/helpers";

const bodyTag: any = document.getElementsByTagName("body") || null;
const bodyTagName: any = bodyTag && bodyTag[0];
bodyTagName && bodyTagName.addEventListener("mouseup", onMouseUp, false);
var isModalOpen = false;

function onMouseUp() {
  const activeTextarea: any = document.activeElement;

  const selectedTag = activeTextarea.tagName;

  if (isValidTag(activeTextarea)) {
     addingDivTag(activeTextarea);
     
    activeTextarea.addEventListener("input", (input: any) => {
      const value: string = selectedTag == "INPUT" && selectedTag == "TEXTAREA"  ?  input.target.value : input.target.textContent;
      const targetValue: string = value.split("$")[1];
      if (TimeRegex.test(targetValue)) {
        const time: string = targetValue.substring(2, 7);
        const convertedTime = convertTimeToTargetZone(time, "Europe/London");
        addingHtmlToDivTag(activeTextarea, convertedTime, time, targetValue);
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
