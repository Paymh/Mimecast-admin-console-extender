// ==UserScript==
// @name         Mimecast Administration Console Extender
// @namespace    https://login-au.mimecast.com/
// @version      0.2
// @description  Adds features to Mimecast Administration Console
// @author       Lachlan Horsey
// @match        https://login-au.mimecast.com/administration/app/
// @icon         https://www.google.com/s2/favicons?domain=mimecast.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict'
  setInterval(() => { //Check for new tasks every 5 seconds
    if (location.hash == "#/message-center/held-messages") { //If we have a held queue 'tab' open check if buttons exists if not add them
      if (!document.querySelector("[name='held-custom-buttons']")) {
        var heldQueueContainer = document.querySelector("[ng-reflect-name='Held Queue']")
        var heldQueueButtonBox = heldQueueContainer.querySelector(".mc-table-before-content-actions")
        addButton("Copy From (Envelope) list to clipboard", "held-custom-buttons", copyFromEnvelopeListHeldQueue, heldQueueButtonBox)
        addButton("Copy From (Header) list to clipboard", "held-custom-buttons", copyFromHeaderListHeldQueue, heldQueueButtonBox)
        addButton("Copy To list to clipboard", "held-custom-buttons", copyToListHeldQueue, heldQueueButtonBox)
        addButton("Copy Subject list to clipboard", "held-custom-buttons", copySubjectListHeldQueue, heldQueueButtonBox)
      }
    } else if (location.hash == "#/message-center/message-tracking") { //If we have a message tracking 'tab' open check if buttons exists if not add them
      if (document.querySelector(".mc-tab-group-after-search")) {
        var messageTrackingContainer = document.querySelector('[tableid="message-center/message-tracking/main-table"]')
        var messageTrackingButtonBox = messageTrackingContainer.querySelector(".mc-table-before-content-actions")
        if (messageTrackingContainer && messageTrackingButtonBox && !document.querySelector("[name='tracking-custom-buttons']")) {
            addButton("Copy From (Envelope) list to clipboard", "tracking-custom-buttons", copyFromEnvelopeListMessageTracking, messageTrackingButtonBox)
            addButton("Copy From (Header) list to clipboard", "tracking-custom-buttons", copyFromHeaderListMessageTracking, messageTrackingButtonBox)
          addButton("Copy To list to clipboard", "tracking-custom-buttons", copyToListMessageTracking, messageTrackingButtonBox)
          addButton("Copy Subject list to clipboard", "tracking-custom-buttons", copySubjectListMessageTracking, messageTrackingButtonBox)
          addButton("Copy Sender IP list to clipboard", "tracking-custom-buttons", copySenderIpListMessageTracking, messageTrackingButtonBox)
        }
      }
    }
    if (document.querySelector(".cdk-overlay-pane aside-container mc-forward")) { //Forward email panel exists
      if (!document.querySelector("[name='forward-email-custom-buttons']")) {
        var forwardEmailContainer = document.querySelector(".cdk-overlay-pane aside-container mc-forward mc-extra-container div")
        addButton("Prefill AusCERT forwarding", "forward-email-custom-buttons", prefillAusCertForward, forwardEmailContainer)
      }
    }
  }, 5000);

  function addButton(text, name, onclick, par) {
    let container = document.createElement("mc-list-dropdown-button")
    par.appendChild(container)
    container.className = "mc-table-actions mc-button-margin-right"
    if (name == "tracking-custom-buttons") { //Hack since Message Tracking Export button has no default margin
      container.style = "margin-left:10px"
    } else {
      container.style = "margin-right:10px"
    }

    container.setAttribute("_ngcontent-c26", "")
    let button = document.createElement("button")
    container.appendChild(button)
    button.innerHTML = text
    button.setAttribute("name", name)
    button.className = "mc-table-actions btn btn-secondary mc-button-margin-right"
    if (name == "forward-email-custom-buttons") { //Another hack since Forward panel uses different classes than other tabs
      button.className += " panel-margin-left"
    }
    // Setting function for button when it is clicked.
    button.onclick = onclick
    return button
  }

  //God I hate these functions so much, will make this better at some point
  function prefillAusCertForward() {
    //Get company name from login info
    let companyName = document.querySelector(".mc-user-details div[ng-bind='navbarCtrl.user.companyName']").innerText
    document.querySelector(".cdk-overlay-pane aside-container mc-forward form mc-text-field[ng-reflect-name='to'] input").value = "auscert@auscert.org.au"
    document.querySelector(".cdk-overlay-pane aside-container mc-forward form mc-text-field[ng-reflect-name='subject'] input").value = "Suspect emails attached"
    document.querySelector(".cdk-overlay-pane aside-container mc-forward form textarea[ng-reflect-name='textBody']").value = `Hi team,

Please find attached possible suspect emails. Please issue take downs and notify where required. Feel free to share the information with the CAUDIT-ISAC, but please remove any sensitive information as required.

Kind regards,
${companyName}`
  }

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
    var list = []
    for (let elem of document.querySelectorAll(`${panelSelector} .mc-table-wrapper.panel .${columnClass}:not([role="columnheader"])`)) {
      list.push(elem.innerText)
    }
    navigator.clipboard.writeText([...new Set(list)].join("\r\n")).then(() => alert("Copied to clipboard"))
  }
})();
