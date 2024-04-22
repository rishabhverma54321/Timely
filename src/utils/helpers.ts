import { StateItem } from "@types/popup";
import { storageKey } from "./constants";

export const convertTimeToTargetZone = (
  timeString: string,
  targetTimeZone: string
): string[] => {
  const [hours, minutes] = timeString
    .split(":")
    .map((part) => parseInt(part, 10));

  const timeValues: string[] = [];
  //04:15
  timeValues.push(timeAmPm(hours, minutes, targetTimeZone));
  if (hours < 12) {
    timeValues.push(timeAmPm(12 + hours, minutes, targetTimeZone));
  }

  return timeValues;
};

function timeAmPm(
  hours: number,
  minutes: number,
  targetTimeZone: string
): string {
  // Create a new Date object with the current date and provided time
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: targetTimeZone,
    hour: "2-digit",
    minute: "2-digit",
  });

  // Format the time in the target timezone
  return formatter.format(date);
}

function findChildTag(chidTag: any, parentTag: any) {
  const contentTag: any = Array.from(chidTag).find((child: any) => {
    return parentTag.textContent === child.textContent;
  });
  if (contentTag && contentTag.children && contentTag.children.length) {
    return findChildTag(contentTag.children, parentTag);
  } else if (contentTag) {
    return contentTag;
  }

  return false;
}

export function findContentTag(parentTag: HTMLElement): HTMLElement {
  const childTags: any = parentTag.children;
  if (parentTag && childTags.length) {
    if (findChildTag(childTags, parentTag)) {
      return findChildTag(childTags, parentTag);
    }
  }
  return parentTag;
}

export const isValidTag = (element: HTMLElement) => {
  const tagName: string = element.tagName;
  switch (tagName) {
    case "INPUT":
    case "TEXTAREA":
      return true;
    default:
      if (element.contentEditable === "true") {
        return true;
      }
      return false;
  }
};

export function getPositionOfWord(
  inputValue: string,
  word: string,
  tag: HTMLElement
) {
  const activeElement = document.activeElement;
  const parentElement: any = activeElement?.parentElement;
  let dummyDiv: any = null;
  let index: number = 0;
  const alreadyHaveDummyDiv = Array.from(parentElement.children).find(
    (tag: any) => tag.id === "tl-div"
  );
  if (!alreadyHaveDummyDiv) {
    dummyDiv = document.createElement("div");
    dummyDiv.style.position = "absolute";
    dummyDiv.style.visibility = "hidden";
    dummyDiv.style.top = "0px";
    dummyDiv.style.left = "0px";
    dummyDiv.style.height = getComputedStyle(tag).height;
    dummyDiv.style.width = getComputedStyle(tag).width;
    dummyDiv.style.padding = getComputedStyle(tag).padding;
    dummyDiv.style.fontSize = getComputedStyle(tag).fontSize;
    dummyDiv.style.fontFamily = getComputedStyle(tag).fontFamily;
    dummyDiv.style.lineHeight = getComputedStyle(tag).lineHeight;
    dummyDiv.id = "tl-div";
  } else {
    dummyDiv = alreadyHaveDummyDiv;
  }
  const span = document.createElement("span");
  span.textContent = word;
  span.id = "tl-child-span";

  parentElement.appendChild(dummyDiv);
  if (tag.tagName == "INPUT" || tag.tagName == "TEXTAREA") {
    index = tag.value.indexOf(word);
    dummyDiv.textContent = tag.value.slice(0, index);
  } else {
    index = tag.textContent.indexOf(word);
    dummyDiv.textContent = tag.textContent.slice(0, index);
  }
  dummyDiv.appendChild(span);
  const spanPosition: any = span.getBoundingClientRect();
  // dummyDiv.textContent = word;
  // const after = dummyDiv.getBoundingClientRect();
  // console.log("beforeafter", before, span);
  spanPosition.left -= 50;
  span.remove();
  // return { ...spanPosition, left: spanPosition.left - 50 };
  return spanPosition;
}

// export function getPositionOfWord(inputValue:string, word:string, tag:HTMLElement) {
//   // Get the position of the word within the input value
//   var wordIndex = inputValue.toLowerCase().indexOf(word.toLowerCase());
//   var position = { left: 0, top: 0 };
//   if (wordIndex !== -1) {
//     // Measure the width of the text preceding the word
//     let textBeforeWord = inputValue.substring(0, wordIndex);

//     // Create a temporary span element to measure the text width
//     let span = document.createElement('div');
//     span.style.visibility = 'hidden';
//     span.style.display = 'inline-block';
//     span.style.whiteSpace = 'pre';
//     span.id = "textBefore_extension"
//     span.textContent = 'hello';

//     // Append the span to the document body to measure its width
//     tag.appendChild(span);
//     console.log("tag",span)

//       // Calculate the left position relative to the input field
//       // position.left = span.offsetWidth;

//       // Calculate the top position relative to the input field
//       let rect = tag.getBoundingClientRect();
//       // position.top = rect.top;
//       position={left: rect.left, top: rect.top}

//       // Adjust the left position based on the input field's padding
//       // position.left += parseFloat(getComputedStyle(tag)['padding-left']);

//       // Remove the temporary span from the document body
//       // document.body.removeChild(span);
//   }

//   return position;
// }

export const getStorage = (): StateItem => {
  return chrome.storage.session.get([storageKey]).then((result: any) => {
    return result[storageKey];
  });
};
