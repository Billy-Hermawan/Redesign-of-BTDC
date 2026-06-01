// --- Back link ---
const params = new URLSearchParams(window.location.search);
const course = params.get('course');
const backLink = document.getElementById('booking-back');

if (backLink && course === 'family-dog-training-1') {
    backLink.textContent = '← Back To Family Dog Training 1';
    backLink.href = 'family-dog-training-1.html';
}

// --- Calendar + Time Slots ---
(function () {
    const MONTH_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const TOTAL_TIME_SLOTS = 6;

    const availableDates = {
        '2026-10': [2, 9, 16, 23, 30],
        '2026-11': [6, 13, 20, 27],
        '2026-12': [4, 11, 18],
        '2027-1':  [8, 15, 22, 29],
        '2027-2':  [5, 12, 19, 26],
        '2027-3':  [5, 12, 19, 26],
    };

    // Times per date — key format: 'YYYY-M-D'
    const availableTimes = {
        '2026-10-2':  ['2:00 PM', '4:00 PM', '6:00 PM', '7:00 PM'],
        '2026-10-9':  ['2:00 PM', '4:00 PM', '6:00 PM'],
        '2026-10-16': ['4:00 PM', '6:00 PM', '7:00 PM'],
        '2026-10-23': ['2:00 PM', '4:00 PM', '6:00 PM', '7:00 PM'],
        '2026-10-30': ['2:00 PM', '6:00 PM'],
        '2026-11-6':  ['2:00 PM', '4:00 PM', '6:00 PM'],
        '2026-11-13': ['4:00 PM', '7:00 PM'],
        '2026-11-20': ['2:00 PM', '4:00 PM', '6:00 PM', '7:00 PM'],
        '2026-11-27': ['2:00 PM', '4:00 PM'],
    };

    let current = new Date(2026, 9, 1);
    let selected = null;
    let selectedTime = null;  

    const grid      = document.getElementById('cal-grid');
    const label     = document.getElementById('cal-month-year');
    const timeGrid  = document.getElementById('time-grid');
    const cartBtn   = document.getElementById('add-to-cart-btn');
    const prevBtn   = document.querySelector('.cal-arrow-left');
    const nextBtn   = document.querySelector('.cal-arrow-right');

    if (!grid) return;

    function updateCartBtn() {
        if (selected && selectedTime) {
            cartBtn.classList.add('active');
        } else {
            cartBtn.classList.remove('active');
        }
    }

    function renderTimes() {
        timeGrid.innerHTML = '';
        const times = selected
            ? (availableTimes[`${selected.year}-${selected.month + 1}-${selected.day}`] || [])
            : [];

        for (let i = 0; i < TOTAL_TIME_SLOTS; i++) {
            const slot = document.createElement('div');
            slot.className = 'time-slot';

            if (times[i]) {
                const t = times[i];
                slot.textContent = t;
                slot.classList.add('available');

                if (selectedTime === t) {
                    slot.classList.add('selected');
                }

                slot.addEventListener('click', () => {
                    selectedTime = selectedTime === t ? null : t;
                    localStorage.setItem('bookingTime', selectedTime || '');
                    renderTimes();
                    updateCartBtn();
                });
            }

            timeGrid.appendChild(slot);
        }
    }

    function render() {
        const y = current.getFullYear();
        const m = current.getMonth();
        const key = `${y}-${m + 1}`;
        const available = availableDates[key] || [];

        label.textContent = `${MONTH_NAMES[m]} ${y}`;
        grid.innerHTML = '';

        const daysInMonth = new Date(y, m + 1, 0).getDate();

        for (let d = 1; d <= daysInMonth; d++) {
            const cell = document.createElement('div');
            cell.className = 'cal-day';
            cell.textContent = d;

            const isAvailable = available.includes(d);
            const isSelected = selected && selected.year === y && selected.month === m && selected.day === d;

            if (isSelected) {
                cell.classList.add('selected');
                cell.addEventListener('click', () => {
                    selected = null;
                    selectedTime = null;
                    render();
                    renderTimes();
                    updateCartBtn();
                });
            } else if (isAvailable) {
                cell.classList.add('available');
                cell.addEventListener('click', () => {
                    selected = { year: y, month: m, day: d };
                    selectedTime = null;
                    localStorage.setItem('bookingDate', JSON.stringify(selected));
                    render();
                    renderTimes();
                    updateCartBtn();
                });
            }

            grid.appendChild(cell);
        }
    }

    function navigateTo(offset) {
        grid.classList.add('fading');
        label.classList.add('fading');
        setTimeout(() => {
            current.setMonth(current.getMonth() + offset);
            render();
            grid.classList.remove('fading');
            label.classList.remove('fading');
        }, 250);
    }

    prevBtn.addEventListener('click', () => navigateTo(-1));
    nextBtn.addEventListener('click', () => navigateTo(1));

    cartBtn.addEventListener('click', () => {
        if (!cartBtn.classList.contains('active')) return;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({
            course: course || 'puppy-preschool',
            date: selected,
            time: selectedTime,
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = '../index.html';
    });

    render();
    renderTimes();
})();
