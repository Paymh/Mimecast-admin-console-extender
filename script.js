// ==UserScript==
// @name         Mimecast Administration Console Extender
// @namespace    https://login-au.mimecast.com/
// @version      0.1
// @description  Adds features to Mimecast Administration Console
// @author       Lachlan Horsey
// @match        https://login-au.mimecast.com/administration/app/
// @icon         https://www.google.com/s2/favicons?domain=mimecast.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  setInterval(() => { //Check for new tasks every 5 seconds
    if (location.hash == "#/message-center/held-messages") { //If we have a held queue 'tab' open check if buttons exists if not add them
      if (!document.querySelector("[name='held-custom-buttons']")) {
        addButton("Copy From (Envelope) list to clipboard", "held-custom-buttons", copyFromEnvelopeListHeldQueue, document.querySelector("[ng-reflect-name='Held Queue'] .mc-table-before-content-actions"));
        addButton("Copy From (Header) list to clipboard", "held-custom-buttons", copyFromHeaderListHeldQueue, document.querySelector("[ng-reflect-name='Held Queue'] .mc-table-before-content-actions"));
        addButton("Copy To list to clipboard", "held-custom-buttons", copyToListHeldQueue, document.querySelector("[ng-reflect-name='Held Queue'] .mc-table-before-content-actions"));
        addButton("Copy Subject list to clipboard", "held-custom-buttons", copySubjectListHeldQueue, document.querySelector("[ng-reflect-name='Held Queue'] .mc-table-before-content-actions"));

      }
    } else if (location.hash == "#/message-center/message-tracking") { //If we have a message tracking 'tab' open check if buttons exists if not add them
      if (document.querySelector(".mc-tab-group-after-search") && document.querySelector("[tableid='message-center/message-tracking/main-table'] .mc-table-before-content-actions") && !document.querySelector("[name='tracking-custom-buttons']")) {
        addButton("Copy From (Envelope) list to clipboard", "tracking-custom-buttons", copyFromEnvelopeListMessageTracking, document.querySelector("[tableid='message-center/message-tracking/main-table'] .mc-table-before-content-actions"));
        addButton("Copy From (Header) list to clipboard", "tracking-custom-buttons", copyFromHeaderListMessageTracking, document.querySelector("[tableid='message-center/message-tracking/main-table'] .mc-table-before-content-actions"));
        addButton("Copy To list to clipboard", "tracking-custom-buttons", copyToListMessageTracking, document.querySelector("[tableid='message-center/message-tracking/main-table'] .mc-table-before-content-actions"));
        addButton("Copy Subject list to clipboard", "tracking-custom-buttons", copySubjectListMessageTracking, document.querySelector("[tableid='message-center/message-tracking/main-table'] .mc-table-before-content-actions"));
        addButton("Copy Sender IP list to clipboard", "tracking-custom-buttons", copySenderIpListMessageTracking, document.querySelector("[tableid='message-center/message-tracking/main-table'] .mc-table-before-content-actions"));
      }
    }
  }, 5000);

  function addButton(text, name, onclick, par) {
    let container = document.createElement("mc-list-dropdown-button")
    par.appendChild(container);
    container.className = "mc-table-actions mc-button-margin-right";
    if (name == "tracking-custom-buttons") { //Hack since Message Tracking Export button has no default margin
      container.style = "margin-left:10px";
    } else {
      container.style = "margin-right:10px";
    }

    container.setAttribute("_ngcontent-c26", "")
    let button = document.createElement("button");
    container.appendChild(button)
    button.innerHTML = text;
    button.setAttribute("name", name)
    button.className = "mc-table-actions btn btn-secondary mc-button-margin-right mc-button-margin-right"
    // Setting function for button when it is clicked.
    button.onclick = onclick;
    return button;
  }

  //God I hate these functions so much, will make this better at some point
  function copyFromHeaderListHeldQueue() {
    copyFromList("[ng-reflect-name='Held Queue']", "mc-column-fromHdr")
  }

  function copyFromEnvelopeListHeldQueue() {
    copyFromList("[ng-reflect-name='Held Queue']", "mc-column-fromEnv")
  }

  function copyToListHeldQueue() {
    copyFromList("[ng-reflect-name='Held Queue']", "mc-column-to")
  }

  function copySubjectListHeldQueue() {
    copyFromList("[ng-reflect-name='Held Queue']", "mc-column-subject")
  }

  function copyFromHeaderListMessageTracking() {
    copyFromList("[tableid='message-center/message-tracking/main-table']", "mc-column-fromHdr")
  }

  function copyFromEnvelopeListMessageTracking() {
    copyFromList("[tableid='message-center/message-tracking/main-table']", "mc-column-fromEnv")
  }

  function copySubjectListMessageTracking() {
    copyFromList("[tableid='message-center/message-tracking/main-table']", "mc-column-subject")
  }

  function copyToListMessageTracking() {
    copyFromList("[tableid='message-center/message-tracking/main-table']", "mc-column-to")
  }

  function copySenderIpListMessageTracking() {
    copyFromList("[tableid='message-center/message-tracking/main-table']", "mc-column-senderIP")
  }

  //Generic function to let us iterate over all rows matching a CSS selector and copy results to a line-break delimited list
  function copyFromList(panelSelector, columnClass) {
    var list = [];
    for (let elem of document.querySelectorAll(`${panelSelector} .mc-table-wrapper.panel .${columnClass}:not([role="columnheader"])`)) {
      list.push(elem.innerText)
    }
    navigator.clipboard.writeText([...new Set(list)].join("\r\n")).then(() => alert("Copied to clipboard"));
  }
})();
