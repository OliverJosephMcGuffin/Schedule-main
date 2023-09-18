let currentDate;

const schedule = {
    
    NAVY: {
        //Navy + Gold = same
        //No M1 + M2 on schedule
        dayA: ['Purple/Free', 'Pink/Math', 'Red/CSA', 'Yellow/Chemistry', 'Orange/French'],
        dayB: ['Green/Free', 'Blue/English', 'Tan/History', 'Purple/Free', 'Pink/Math'],
        dayC: ['Yellow/Chemistry', 'Red/CSA', 'Orange/French', 'Green/Digital Networking', 'Blue/English'],
        dayD: ['Tan/History', 'Purple/Free', 'Pink/Math', 'Red/CSA', 'Yellow/Chemistry'],
        dayE: ['Orange/French', 'PurpleFree', 'Pink/Math', 'Tan/History', 'Purple/Free'],
        dayF: ['Pink/Math', 'Red/CSA', 'Yellow/Chemistry', 'Orange/French', 'Green/Digital Networking'],
        dayG: ['Blue/English', 'Tan/History', 'Purple/Free', 'Pink/Math', 'Red/CSA'],
        dayH: ['Yellow/Chemistry', 'Orange/French', 'Green/Free', 'Blue/English', 'Tan/History']
    },
    GOLD: {
        //Navy + Gold = same
        //No M1 + M2 on schedule
        dayA: ['Purple/Free', 'Pink/Math', 'Red/CSA', 'Yellow/Chemistry', 'Orange/French'],
        dayB: ['Green/Digital Networking', 'Blue/English', 'Tan/History', 'Purple/Free', 'Pink/Math'],
        dayC: ['Yellow/Chemistry', 'Red/CSA', 'Orange/French', 'Free', 'Blue/English'],
        dayD: ['Tan/History', 'Purple/Free', 'Pink/Math', 'Red/CSA', 'Yellow/Chemistry'],
        dayE: ['Orange/French', 'Green/Digital Networking', 'Blue/English', 'Tan/History', 'Purple/Free'],
        dayF: ['Pink/Math', 'Red/CSA', 'Yellow/Chemistry', 'Orange/French', 'Green/Digital Networking'],
        dayG: ['Blue/English', 'Tan/History', 'Purple/Free', 'Pink/Math', 'Red/CSA'],
        dayH: ['Yellow/Chemistry', 'Orange/French', 'Green/Digital Networking', 'Blue/English', 'Tan/History']
    }
};

function getToday() {
    return new Promise((resolve, reject) => {
        currentDate = new Date().toISOString().split('T')[0];
        const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3-6MgEPFUcHbLfa7q97_I6BI8CJvLZA0FDPxMwKOEFKYZs1GAw_4CRt6oOIWhMEITpOKzYrW2u7Ef/pub?gid=0&single=true&output=csv';
        const cacheBuster = new Date().getTime();
        const urlWithCacheBuster = `${url}&_=${cacheBuster}`;
        fetch(urlWithCacheBuster, { cache: "no-store" })    
            .then(response => response.text())
            .then(data => {
                const lines = data.split('\n');
                for (let i = 1; i < lines.length; i++) {
                    const [date, scheduleDay, week] = lines[i].split(',');
                    const currentWeek = week.trim();
                    if (date === currentDate) {
                        if(currentWeek == "Gold"){
                        const correctDay = scheduleDay.trim();
                        const colors = schedule.GOLD[correctDay];
                        resolve(colors);
                        return;
                        } else{
                            const correctDay = scheduleDay.trim();
                        const colors = schedule.NAVY[correctDay];
                        resolve(colors);
                        return;
                        }
                    }
                }
                console.log(`No schedule found for ${currentDate}`);
                reject(new Error(`No schedule found for ${currentDate}`));
            })
            .catch(error => {
                console.error('An error occurRed/CSA:', error);
                reject(error);
            });
    });
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getTodaySchedule") {
        getToday().then(colors => {
            sendResponse({ status: "success", colors: colors });
        }).catch(error => {
            sendResponse({ status: "error", error: error.toString() });
        });
        return true;  // Indicates you wish to send a response asynchronously.
    }
    if (message.action === "getTomorrowSchedule") {
        console.log("Fetching tomorrow's schedule...");
        getTomorrow().then(colors => {
            sendResponse({ status: "success", colors: colors });
        }).catch(error => {
            sendResponse({ status: "error", error: error.toString() });
        });
        return true;  // Indicates you wish to send a response asynchronously.
    }
});
