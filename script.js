

  <script>
// script.js

document.getElementById("downloadExcel").addEventListener("click", downloadUpdatedExcel);
document.getElementById("shareAll").addEventListener("click", shareAllQRCodes);

function processFile() {
    let fileInput = document.getElementById("excelFile").files[0];
    if (!fileInput) {
        alert("Please upload an Excel file!");
        return;
    }

    let reader = new FileReader();
    reader.readAsArrayBuffer(fileInput);
    reader.onload = function (e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: 'array' });
        let sheetName = workbook.SheetNames[0];
        let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        generateQRCodes(sheetData);
    };
}

function generateQRCodes(data) {
    let tableBody = document.querySelector("#customerTable tbody");
    tableBody.innerHTML = "";

    let merchantUPI = document.getElementById("merchantUPI").value;
    let merchantName = document.getElementById("merchantName").value;
    let businessType = document.getElementById("businessType").value;

    data.forEach((row, index) => {
        let amount = row.Amount;
        let name = row.Name;
        let orderName = row["Order Name"];

        let upiLink = `upi://pay?pa=${merchantUPI}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR`;
        let qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiLink)}`;

        let qrCardHTML = generateQRCard(merchantName, merchantUPI, qrCodeURL);

        let newRow = `<tr>
            <td>${name}</td>
            <td>${orderName}</td>
            <td>₹${amount}</td>
            <td>${qrCardHTML}</td>
            <td>
                <div class="action-buttons">
                    <img src="https://e7.pngegg.com/pngimages/528/1/png-clipart-logo-whatsapp-computer-icons-viber-text-viber.png" alt="WhatsApp" onclick="shareQR('${upiLink}', '${name}', '${amount}', '${orderName}', '${businessType}', '${row.Email}')">
                    <img src="https://static.vecteezy.com/system/resources/previews/010/144/907/original/email-and-mail-icon-sign-symbol-design-free-png.png" alt="Email" onclick="shareEmail('${upiLink}', '${name}', '${amount}', '${orderName}', '${businessType}', '${row.Email}')">
                    <button onclick="downloadQR('${merchantName}', '${merchantUPI}', '${qrCodeURL}', ${index})">Download QR</button>
                </div>
            </td>
        </tr>`;

        tableBody.innerHTML += newRow;
    });
}

function generateQRCard(merchantName, merchantUPI, qrCodeURL) {
    return `
        <div class="qr-card">
            <h3>${merchantName}</h3>
            <div id="qrcode">
                <img src="${qrCodeURL}" alt="QR Code" width="150">
            </div>
            <p>${merchantUPI}</p>
            <p>Scan and pay with any BHIM UPI app</p>
            <div class="upi-logos">
        <img src="https://res.cloudinary.com/dqejs3lba/image/upload/v1741066109/WhatsApp_Image_2025-03-03_at_9.29.42_PM_jvitox.jpg" alt="BHIM">
        <img src="https://res.cloudinary.com/dqejs3lba/image/upload/v1741066110/WhatsApp_Image_2025-03-03_at_9.31.50_PM_zvddid.jpg" alt="UPI">
        <img src="https://res.cloudinary.com/dqejs3lba/image/upload/v1741066109/WhatsApp_Image_2025-03-03_at_9.33.19_PM_bwmw98.jpg" alt="Google Pay">
        <img src="https://res.cloudinary.com/dqejs3lba/image/upload/v1741066110/WhatsApp_Image_2025-03-03_at_9.35.44_PM_nqxac9.jpg" alt="PhonePe">
        <img src="https://res.cloudinary.com/dqejs3lba/image/upload/v1741066110/WhatsApp_Image_2025-03-03_at_9.36.08_PM_mdc5aa.jpg" alt="Paytm">
        <img src="https://res.cloudinary.com/dqejs3lba/image/upload/v1741066110/WhatsApp_Image_2025-03-03_at_9.37.33_PM_ssabdw.jpg" alt="Amazon Pay">
        </div>
        <p class="footer-text">Create your own UPI QR code at <a href="https://ravann.free.nf">settleQR</a></p>
    
    `;
}

function shareQR(upiLink, name, amount, orderName, businessType, email) {
    let message = `Hi ${name}, your order ${orderName} of ₹${amount} is pending. Pay your bill to ${upiLink}`;

    if (businessType === "pizza hut" || businessType === "dominos") {
        message = `Hi ${name}, your pizza order ${orderName} of ₹${amount} is pending. Pay your bill to ${upiLink}`;
    } else if (businessType === "cafe") {
        message = `Hi ${name}, your cafe order ${orderName} of ₹${amount} is pending. Pay your bill to ${upiLink}`;
    } else if (businessType === "bakery shop") {
        message = `Hi ${name}, your bakery order ${orderName} of ₹${amount} is pending. Pay your bill to ${upiLink}`;
    } else if (businessType === "vine shop") {
        message = `Hi ${name}, your vine order ${orderName} of ₹${amount} is pending. Pay your bill to ${upiLink}`;
    }

    let whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
}

function shareEmail(upiLink, name, amount, orderName, businessType, email) {
    let message = `Hi ${name}, your order ${orderName} of ₹${amount} is pending. Pay your bill to ${upiLink}`;

    if (businessType === "pizza hut" || businessType === "dominos") {
        message = `Hi ${name}, your pizza order ${orderName} of ₹${amount} is pending. Pay your bill to ${upiLink}`;
    } else if (businessType === "cafe") {
        message = `Hi ${name}, your cafe order ${orderName} of ₹${amount} is pending. Pay your bill to ${upiLink}`;
    } else if (businessType === "bakery shop") {
        message = `Hi ${name}, your bakery order ${orderName} of ₹${amount} is pending. Pay your bill to ${upiLink}`;
    } else if (businessType === "vine shop") {
        message = `Hi ${name}, your vine order ${orderName} of ₹${amount} is pending. Pay your bill to ${upiLink}`;
    }

    let mailtoURL = `mailto:${email}?subject=Payment%20Request&body=${encodeURIComponent(message)}`;

    window.open(mailtoURL, "_blank");
}

function downloadUpdatedExcel() {
    let table = document.getElementById("customerTable");
    let ws = XLSX.utils.table_to_sheet(table);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "QR_Payments");
    XLSX.writeFile(wb, "Updated_Orders.xlsx");
}

function shareAllQRCodes() {
    let table = document.getElementById("customerTable");
    let rows = table.querySelectorAll("tbody tr");

    rows.forEach(row => {
        let upiLink = row.querySelector(".action-buttons img").getAttribute("onclick").split("'")[1];
        let name = row.cells[0].textContent;
        let amount = row.cells[2].textContent.replace("₹", "");
        let orderName = row.cells[1].textContent;
        let businessType = document.getElementById("businessType").value;
        let email = row.querySelector(".action-buttons img[alt='Email']").getAttribute("onclick").split("'")[5];

        shareQR(upiLink, name, amount, orderName, businessType, email);
    });
}

function downloadQR(merchantName, merchantUPI, qrCodeURL, index) {
    let qrCardHTML = generateQRCard(merchantName, merchantUPI, qrCodeURL);
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = qrCardHTML;
    document.body.appendChild(tempDiv);
    let element = tempDiv.querySelector('.qr-card');
    let fileName = `QR_${index}.jpeg`;

    html2canvas(element).then(canvas => {
        let link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg');
        link.download = fileName;
        link.click();
        document.body.removeChild(tempDiv);
    });
}


                      </script>  