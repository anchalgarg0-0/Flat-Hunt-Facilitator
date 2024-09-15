var currentTab = 0; // Current tab is set to be the first tab (0)
var clickedOnDownload = false;
const API_KEY = "eea2bafd06c85174bf3dae575e28937ea1fd936f";
const ORG_ID = "26724";
const BASE_URL = "https://appserver.beaconstac.com/api/2.0";
var landingPageLink;
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == x.length - 1) {
    document.getElementById("nextBtn").innerHTML = "Download QR";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n);
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    document.getElementById("nextBtn").onclick = createLinkpage();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x,
    y,
    i,
    valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByClassName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    console.log(y[i].value);
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i,
    x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}

var pp_url = "https://drive.google.com/drive/my-drive";

async function uploadPP(PP) {
  console.log(PP);
  const data = new FormData();
  data.append("file", PP);
  data.append("upload_preset", "preset");
  data.append("cloud_name", "dq5l1tvxt");
  fetch("https://api.cloudinary.com/v1_1/dq5l1tvxt/image/upload", {
    method: "post",
    body: data,
  })
    .then((res) => res.json())
    .then((data) => {
      pp_url = data.url;
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

var flatImage;

async function uploadFlatImage(FI) {
  const data = new FormData();
  data.append("file", FI);
  data.append("upload_preset", "preset");
  data.append("cloud_name", "dq5l1tvxt");
  fetch("https://api.cloudinary.com/v1_1/dq5l1tvxt/image/upload", {
    method: "post",
    body: data,
  })
    .then((res) => res.json())
    .then((data) => {
      flatImage = data.url;
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}


var ownership = "Owner/Broker";
function ownerShip(temp) {
  ownership = temp;
}
var fullName;

var code = "91";
function countryCode(temp) {
  code = temp;
}

async function createLinkpage() {
  myHeaders = new Headers();
  myHeaders.append("Authorization", `Token ${API_KEY}`);
  myHeaders.append("Content-Type", "application/json");

  fullName = document.getElementById("full-name").value;
  var email = document.getElementById("email").value;
  var phoneNumber = document.getElementById("phone").value;

  var raw = JSON.stringify({
    name: fullName,
    meta: {},
    attributes: {
      background: 1,
      background_color: "#ffffff",
      font: "Inter",
      title_text_color: "#000000",
      button_color: "#4b4efc",
      button_text_color: "#ffffff",
      button_type: 2,
      fill_button: true,
      button_style_bold: true,
      button_style_underline: false,
      button_style_italic: false,
      button_style_strikethrough: false,
      image_url: "",
      video_url: "",
    },
    links: [
      {
        url_type: 1,
        deleted: false,
        url: flatImage,
        title: "Property Image",
        image_type: 1,
        image_url: "",
      },
      {
        url_type: 1,
        deleted: false,
        url: "https://www.google.com",
        title: "Owner Details",
        image_type: 1,
        image_url: "",
      },
      {
        url_type: 12,
        deleted: false,
        url: "",
        title: "Call",
        image_type: 1,
        image_url: "",
        field_data: {
          phone: "+" + code + phoneNumber,
        },
      },
      {
        url_type: 11,
        deleted: false,
        url: "",
        title: "Contact via Email",
        image_type: 1,
        image_url: "",
        field_data: {
          recipient: email,
          subject: "Query regarding your property",
          body: "",
        },
      },
    ],
    title: fullName,
    description: ownership,
    pass_parameters: true,
    deleted: false,
    thumbnail: pp_url,
    threat_active: false,
    organization: ORG_ID,
    state: "A",
    created: "",
    updated: "",
    timezone: "UTC",
    password: "",
    slug: "",
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  let response = await fetch(
    `${BASE_URL}/linkpage/?organization=${ORG_ID}`,
    requestOptions
  );
  console.log(response);
  let parsedResponse = await response.json();
  console.log(parsedResponse);
  let linkpage_id = parsedResponse.id;
  console.log("linkpage_id", linkpage_id);

  // fetch(`${BASE_URL}/linkpage/?organization=${ORG_ID}`, requestOptions)
  //   .then(response => response.json())
  //   .then(result => console.log(result))
  //   .catch(error => console.log('error', error));

  createQRCode(linkpage_id);
}

async function createQRCode(linkpage_id) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Token ${API_KEY}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    meta: {
      dynamic_sub_campaign: "linkpage",
    },
    campaign: {
      content_type: 18,
      campaign_active: true,
      timezone: "Asia/Calcutta",
      organization: 7269,
      link_page: linkpage_id,
    },
    domain: 1,
    attributes: {
      color: "#000000",
      colorDark: "#000000",
      colorLight: "#8f00ff",
      gradientType: "none",
      backgroundImage: "",
      backgroundColor: "#ffffff",
      logoImage: "",
      frameStyle: "none",
      frameColor: "#000000",
      frameText: "",
      frameTextColor: "#000000",
      dataPattern: "square",
      eyeBallShape: "square",
      eyeFrameShape: "square",
      eyeBallColor: "#000000",
      eyeFrameColor: "#000000",
      logoBackground: true,
      margin: 80,
      dotScale: 1,
      rectangular: true,
      logoWidth: 0,
      logoHeight: 0,
      logoMargin: 10,
      logoScale: 0.2,
      isVCard: false,
    },
    state: "A",
    view_limit: null,
    qr_type: 2,
    is_created_for_bulk: false,
    origin: "https://q.qrcodes.pro",
    hasUsageLimit: false,
    isScanable: {
      message: "",
      scanScore: "EXCELLENT",
    },
    domainString: "",
    urlModel: {
      url: "",
    },
    smsModel: {
      phone: "",
      body: "",
    },
    phoneModel: {
      phone: "",
    },
    emailModel: {
      email: "",
      subject: "",
      body: "",
    },
    vcardModel: {
      first_name: "",
      last_name: "",
      phone: {
        home: "",
        work: "",
        mobile: "",
      },
      email: "",
      company: "",
      designation: "",
      website: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    },
    textModel: {
      text: "",
    },
    wifiModel: {
      ssid: "",
      password: "",
      hidden: false,
      encryption: "WPA",
    },
    linkpageModel: {
      linkpage_url: "",
    },
    organization: ORG_ID,
    generatedData: "",
    qrCampaignType: "linkpage",
    password: null,
    name: fullName,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  let response = await fetch(
    `${BASE_URL}/qrcodes/?organization=${ORG_ID}`,
    requestOptions
  );
  let parsedResponse = await response.json();
  let QRID = parsedResponse.id;
  console.log("QRID", QRID);

  // fetch(`${BASE_URL}/qrcodes/?organization=${ORG_ID}`, requestOptions)
  //   .then(response => response.json())
  //   .then(result => console.log(result))
  //   .catch(error => console.log('error', error));

  createQRCodeImage(QRID);
}

async function createQRCodeImage(QRID) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Token ${API_KEY}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  let response = await fetch(
    `${BASE_URL}/qrcodes/${QRID}/download/?size=1024&error_correction_level=5&canvas_type=png`,
    requestOptions
  );
  console.log(response);
  let parsedResponse = await response.json();
  console.log(parsedResponse);
  let QR_link = parsedResponse.urls.png;
  console.log("QR_link", QR_link);

  // fetch(`${BASE_URL}/qrcodes/${QRID}/download/?size=1024&error_correction_level=5&canvas_type=jpg`, requestOptions)
  //   .then(response => response.json())
  //   .then(result => console.log(result))
  //   .catch(error => console.log('error', error));

  downloadQRCode(QR_link);
}

async function downloadQRCode(QR_link) {
  document.getElementById("regForm").innerHTML =
    "<img src=" +
    QR_link +
    "  alt='QR Code' height='500' width='500' style='display: block; margin-left: auto; margin-right: auto;'>";
}