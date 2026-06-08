let currentPoll = null;
let currentUser = null;
let currentVotes = {};
let isAdmin = false;

const urlParams = new URLSearchParams(window.location.search);
const pollId = urlParams.get('poll');
const adminKey = urlParams.get('admin');
let userName = localStorage.getItem(`user_${pollId}`) || null;

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM Content Loaded');

  if (!pollId) {
    console.log('No poll ID - showing admin panel');
    showAdminPanel();
    loadAdminPolls();
    return;
  }

  console.log('Poll ID found:', pollId);
  isAdmin = adminKey === 'admin123';

  if (!userName) {
    // Generate a unique anonymous voter ID
    userName = 'Voter ' + Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem(`user_${pollId}`, userName);
  }

  await loadPoll();
});

function showAdminPanel() {
  document.getElementById('adminPanel').classList.remove('hidden');
  document.getElementById('participantView').classList.add('hidden');
}

function promptForName() {
  const name = prompt('Please enter your name to participate:');
  if (name && name.trim()) {
    localStorage.setItem(`user_${pollId}`, name.trim());
    location.reload();
  }
}

async function loadPoll() {
  try {
    console.log('Loading poll:', pollId, 'User:', userName);
    const response = await fetch(`/api/planning/${pollId}`);
    console.log('Response status:', response.status);

    if (!response.ok) throw new Error('Poll not found');

    currentPoll = await response.json();
    console.log('Poll loaded:', currentPoll);

    currentUser = userName;
    currentVotes = currentPoll.votes[currentUser] || { dates: {}, unavailable: false, alternativeDate: null };

    displayPoll();
  } catch (error) {
    console.error('Error loading poll:', error);
    document.body.innerHTML = `
      <div style="max-width: 600px; margin: 50px auto; text-align: center; font-family: Arial; color: #dc2626;">
        <h1 style="font-size: 24px; margin-bottom: 15px;">Poll Not Found</h1>
        <p>${error.message}</p>
      </div>
    `;
  }
}

function displayPoll() {
  console.log('Displaying poll...');

  // REPLACE ENTIRE PAGE with simple HTML
  let html = '<div style="max-width: 900px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">';

  // Header
  html += `<div style="background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 40px; border-radius: 8px; margin-bottom: 30px;">
    <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: bold;">${currentPoll.title}</h1>
    <p style="margin: 0; font-size: 16px; opacity: 0.95;">${currentPoll.description || 'Choose your available dates'}</p>
  </div>`;

  // Dates section
  html += '<h2 style="font-size: 22px; font-weight: bold; margin: 30px 0 20px 0;">📅 Select Dates</h2>';
  html += currentPoll.dates.map((date, index) => {
    const dateObj = new Date(date);
    const isSelected = currentVotes.dates[index];
    return `
      <div onclick="toggleDateVote(${index})" style="background: ${isSelected ? '#dbeafe' : '#f9fafb'}; border: 2px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}; padding: 20px; border-radius: 8px; margin-bottom: 12px; cursor: pointer; display: flex; justify-content: space-between;">
        <div>
          <div style="font-weight: bold; color: #000; font-size: 16px;">${dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
          <div style="color: #666; font-size: 14px;">${dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div style="font-size: 28px; font-weight: bold; color: ${isSelected ? '#3b82f6' : '#ccc'};">${isSelected ? '✓' : '○'}</div>
      </div>
    `;
  }).join('');

  // 4th Option
  const cannotMakeMonth = currentVotes.unavailable;
  html += `
    <div onclick="toggleUnavailable()" style="background: ${cannotMakeMonth ? '#fee2e2' : '#f9fafb'}; border: 2px solid ${cannotMakeMonth ? '#dc2626' : '#e5e7eb'}; padding: 20px; border-radius: 8px; margin-bottom: 12px; cursor: pointer; display: flex; justify-content: space-between;">
      <div>
        <div style="font-weight: bold; color: #000; font-size: 16px;">❌ I can't make it this month</div>
        <div style="color: #666; font-size: 14px;">Not available for any of the above dates</div>
      </div>
      <div style="font-size: 28px; font-weight: bold; color: ${cannotMakeMonth ? '#dc2626' : '#ccc'};">${cannotMakeMonth ? '✓' : '○'}</div>
    </div>
  `;

  // Find date with most votes
  const dateVoteCounts = currentPoll.dates.map((date, index) => ({
    date,
    index,
    count: Object.values(currentPoll.votes).filter(v => v.dates[index]).length
  }));
  const topDate = dateVoteCounts.reduce((a, b) => a.count > b.count ? a : b, dateVoteCounts[0] || {});
  const topVoteCount = topDate.count || 0;
  const targetVotes = 6;
  const progressPercent = Math.min(Math.round((topVoteCount / targetVotes) * 100), 100);

  // Calculate color gradient: yellow (0) -> green (6+)
  let barColor;
  if (topVoteCount === 0) {
    barColor = '#fbbf24'; // Yellow
  } else if (topVoteCount >= 6) {
    barColor = '#22c55e'; // Full green
  } else {
    // Gradient from yellow to green
    const ratio = topVoteCount / 6;
    if (ratio < 0.5) {
      // Yellow to orange
      barColor = `hsl(45, 97%, ${60 - ratio * 20}%)`;
    } else {
      // Orange to green
      barColor = `hsl(${120 * (ratio - 0.5) * 2}, 100%, ${50}%)`;
    }
  }

  const topDateObj = topDate.date ? new Date(topDate.date) : null;
  const topDateString = topDateObj ? topDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No votes yet';

  // Responses section header with progress
  html += '<h2 style="font-size: 22px; font-weight: bold; margin: 40px 0 20px 0;">📊 Voting Status</h2>';

  // Single Progress Bar
  html += `
    <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
      <div style="margin-bottom: 12px;">
        <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
          Leading date: <strong>${topDateString}</strong> • <strong>${topVoteCount} vote${topVoteCount !== 1 ? 's' : ''}</strong>
        </div>
      </div>
      <div style="background: #e5e7eb; height: 32px; border-radius: 12px; overflow: hidden; margin-bottom: 12px;">
        <div style="background: ${barColor}; height: 100%; width: ${progressPercent}%; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: bold; transition: width 0.3s ease, background 0.3s ease;">
          ${progressPercent > 10 ? topVoteCount + ' / 6' : ''}
        </div>
      </div>
      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; font-size: 13px; line-height: 1.6; color: #555;">
        <strong>📌 Target:</strong> We need 6 people to confirm a date. Once we reach this goal, we'll dig into our user base to find replacements for anyone who can't make it.
      </div>
    </div>
  `;

  html += '<h2 style="font-size: 18px; font-weight: bold; margin: 30px 0 15px 0;">👥 All Responses</h2>';
  const votes = Object.entries(currentPoll.votes);

  if (votes.length === 0) {
    html += '<p style="color: #999; text-align: center; padding: 20px;">Waiting for responses...</p>';
  } else {
    html += votes.map(([name, vote]) => {
      let status;
      if (vote.unavailable) {
        status = '❌ Can\'t make it this month';
      } else {
        const availableCount = Object.values(vote.dates).filter(Boolean).length;
        status = availableCount === 0 ? '⏳ Not yet responded' : `✓ ${availableCount} date(s)`;
      }
      return `
        <div style="background: #f9fafb; padding: 12px; border-radius: 6px; margin-bottom: 8px; display: flex; justify-content: space-between; border: 1px solid #e5e7eb;">
          <span style="font-weight: 500;">${name}</span>
          <span style="color: #666;">${status}</span>
        </div>
      `;
    }).join('');
  }

  // Submit button
  html += `<button onclick="submitVote()" style="width: 100%; background: #2563eb; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer; margin-top: 40px;">💾 Save Your Preferences</button>`;
  html += '<p id="submitMessage" style="text-align: center; color: #666; margin-top: 15px;"></p>';

  html += '</div>';

  // SET ENTIRE BODY
  document.body.innerHTML = html;
  console.log('Poll page rendered successfully');
}

function countAlternativeSuggestions(date) {
  return Object.values(currentPoll.votes).filter(v => v.alternativeDate === date).length;
}

function toggleDateVote(index) {
  currentVotes.dates[index] = !currentVotes.dates[index];
  displayPoll();
}

function toggleUnavailable() {
  currentVotes.unavailable = !currentVotes.unavailable;
  if (currentVotes.unavailable) {
    // Clear all date selections if "can't make it" is selected
    currentVotes.dates = {};
    currentPoll.dates.forEach((_, i) => {
      currentVotes.dates[i] = false;
    });
  }
  displayPoll();
}

function toggleAlternativeDate() {
  const notAvailableEl = document.getElementById('notAvailable');
  const alternativeDateSectionEl = document.getElementById('alternativeDateSection');
  const alternativeDateEl = document.getElementById('alternativeDate');

  if (notAvailableEl) {
    const isChecked = notAvailableEl.checked;
    if (alternativeDateSectionEl) {
      alternativeDateSectionEl.classList.toggle('hidden', !isChecked);
    }
    currentVotes.unavailable = isChecked;
    if (!isChecked) {
      currentVotes.alternativeDate = null;
      if (alternativeDateEl) {
        alternativeDateEl.value = '';
      }
    }
  }
}

async function submitAlternativeDate() {
  const dateEl = document.getElementById('alternativeDate');
  const messageEl = document.getElementById('altDateMessage');

  if (!dateEl || !messageEl) return;

  const dateValue = dateEl.value;
  if (!dateValue) {
    messageEl.textContent = 'Please select a date';
    messageEl.style.color = '#dc2626';
    return;
  }
  currentVotes.alternativeDate = new Date(dateValue).toISOString();
  messageEl.textContent = 'Date saved! Remember to click "Save Your Preferences" below.';
  messageEl.style.color = '#16a34a';
}

async function submitVote() {
  try {
    const response = await fetch(`/api/planning/${pollId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: currentUser,
        votes: currentVotes
      })
    });

    if (!response.ok) throw new Error('Failed to submit vote');

    const msgEl = document.getElementById('submitMessage');
    if (msgEl) {
      msgEl.textContent = '✓ Your preferences have been saved!';
      msgEl.style.color = '#16a34a';
    }
    setTimeout(() => {
      loadPoll();
    }, 500);
  } catch (error) {
    const msgEl = document.getElementById('submitMessage');
    if (msgEl) {
      msgEl.textContent = '✗ Error saving preferences';
      msgEl.style.color = '#dc2626';
    }
  }
}

function displayParticipants() {
  const container = document.getElementById('participantsResponse');
  if (!container) return;

  const votes = Object.entries(currentPoll.votes);

  if (votes.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999; padding: 15px;">No responses yet</p>';
    return;
  }

  container.innerHTML = votes.map(([name, vote]) => {
    const availableCount = Object.values(vote.dates).filter(Boolean).length;
    const status = vote.unavailable ? '⛔ Not available next month' : `✓ ${availableCount} date(s)`;
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 12px; border-radius: 4px; border: 1px solid #d1d5db; margin-bottom: 8px;">
        <span style="font-weight: 500; color: #111827; font-size: 14px;">${name}</span>
        <span style="font-size: 14px; color: #666;">${status}</span>
      </div>
    `;
  }).join('');
}

async function createPoll() {
  const title = document.getElementById('pollTitle').value;
  const description = document.getElementById('pollDescription').value;
  const date1 = document.getElementById('date1').value;
  const date2 = document.getElementById('date2').value;
  const date3 = document.getElementById('date3').value;
  const participantCount = parseInt(document.getElementById('participantCount').value) || 8;

  if (!title || !date1 || !date2 || !date3) {
    alert('Please fill in all required fields');
    return;
  }

  const dates = [date1, date2, date3].map(d => new Date(d).toISOString()).filter(Boolean);

  try {
    const response = await fetch('/api/planning/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        dates,
        participantCount
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create poll');

    const pollUrl = `${window.location.origin}/planning.html?poll=${data.pollId}`;
    alert(`Poll created! Share this link:\n\n${pollUrl}`);

    // Clear form (with null checks)
    const fields = ['pollTitle', 'pollDescription', 'date1', 'date2', 'date3', 'participantCount'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    loadAdminPolls();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function loadAdminPolls() {
  try {
    const response = await fetch('/api/planning/list');
    const polls = await response.json();

    const listContainer = document.getElementById('pollsList');
    if (polls.length === 0) {
      listContainer.innerHTML = '<p class="text-gray-500">No polls created yet.</p>';
      return;
    }

    listContainer.innerHTML = polls.map(poll => {
      const respondedCount = Object.keys(poll.votes).length;
      const expectedCount = poll.expectedParticipants || 8;
      const responseRate = expectedCount > 0 ? Math.round((respondedCount / expectedCount) * 100) : 0;
      return `
        <div class="bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition overflow-hidden">
          <div class="p-4">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h4 class="font-bold text-lg text-gray-900">${poll.title}</h4>
                <p class="text-sm text-gray-600 mt-1">${poll.description || 'No description'}</p>
              </div>
              <button onclick="deletePoll('${poll.id}')" class="text-red-600 hover:text-red-700 font-medium ml-4">✕</button>
            </div>

            <!-- Response Status -->
            <div class="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-gray-100">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">${respondedCount}/${expectedCount}</div>
                <div class="text-xs text-gray-600">Responses</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">${responseRate}%</div>
                <div class="text-xs text-gray-600">Rate</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">${poll.dates.length}</div>
                <div class="text-xs text-gray-600">Dates</div>
              </div>
            </div>

            <!-- Share Link -->
            <div class="bg-blue-50 rounded p-2 mb-4 flex items-center gap-2">
              <input type="text" value="${window.location.origin}/planning.html?poll=${poll.id}" class="flex-1 px-2 py-1 bg-transparent text-xs font-mono text-gray-700 border-0 outline-none" readonly>
              <button onclick="copyShareLink('${poll.id}')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-3 rounded transition whitespace-nowrap">Copy Link</button>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button onclick="managePoll('${poll.id}')" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition">View Details</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading polls:', error);
  }
}

function copyShareLink(pollId) {
  const url = `${window.location.origin}/planning.html?poll=${pollId}`;
  navigator.clipboard.writeText(url).then(() => {
    alert('✓ Link copied to clipboard!');
  }).catch(err => {
    console.error('Copy failed:', err);
    alert('Failed to copy. The link is:\n\n' + url);
  });
}

let currentEditingPoll = null;

async function managePoll(pollId) {
  try {
    const response = await fetch(`/api/planning/${pollId}`);
    if (!response.ok) throw new Error('Poll not found');

    currentEditingPoll = await response.json();

    // Populate modal (with null checks)
    const titleEl = document.getElementById('modalPollTitle');
    const descEl = document.getElementById('modalPollDescription');
    const linkEl = document.getElementById('shareLink');

    if (titleEl) titleEl.value = currentEditingPoll.title;
    if (descEl) descEl.value = currentEditingPoll.description;
    if (linkEl) linkEl.value = `${window.location.origin}/planning.html?poll=${pollId}`;

    // Display dates
    const datesContainer = document.getElementById('modalDates');
    datesContainer.innerHTML = currentEditingPoll.dates.map((date, index) => {
      const dateObj = new Date(date);
      return `
        <div class="flex items-center justify-between bg-gray-50 rounded p-3">
          <div>
            <div class="font-medium text-gray-900">${dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
            <div class="text-sm text-gray-600">${dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
          <div class="text-sm font-semibold text-blue-600">${countVotesForDate(pollId, index)} votes</div>
        </div>
      `;
    }).join('');

    // Display voters (all responses)
    const participantsContainer = document.getElementById('modalParticipants');
    const voterEntries = Object.entries(currentEditingPoll.votes);

    if (voterEntries.length === 0) {
      participantsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No responses yet</p>';
    } else {
      participantsContainer.innerHTML = voterEntries.map(([name, vote]) => {
        return `
          <div class="flex items-center justify-between bg-white border border-gray-200 rounded p-3">
            <div class="text-sm font-medium text-gray-900">${name}</div>
            <div class="text-xs font-semibold text-green-600">✓ Responded</div>
          </div>
        `;
      }).join('');
    }

    // Response summary
    const respondedCount = voterEntries.length;
    const expectedCount = currentEditingPoll.expectedParticipants || 8;
    document.getElementById('responseSummary').innerHTML = `
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="text-2xl font-bold text-blue-600">${respondedCount}</div>
          <div class="text-sm text-gray-700">Responses received</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-orange-600">${expectedCount}</div>
          <div class="text-sm text-gray-700">Expected participants</div>
        </div>
      </div>
    `;

    // Show modal
    document.getElementById('pollModal').classList.remove('hidden');
  } catch (error) {
    alert('Error loading poll: ' + error.message);
  }
}

function countVotesForDate(pollId, dateIndex) {
  if (!currentEditingPoll) return 0;
  return Object.values(currentEditingPoll.votes).filter(v => v.dates[dateIndex]).length;
}

function closeModal() {
  document.getElementById('pollModal').classList.add('hidden');
}

function copyModalLink() {
  const link = document.getElementById('shareLink').value;
  navigator.clipboard.writeText(link).then(() => {
    const message = document.getElementById('copyMessage');
    message.textContent = '✓ Link copied to clipboard!';
    setTimeout(() => {
      message.textContent = '';
    }, 2000);
  }).catch(err => {
    console.error('Copy failed:', err);
    alert('Failed to copy link');
  });
}

async function deletePoll(pollId) {
  if (!confirm('Are you sure you want to delete this poll?')) return;

  try {
    const response = await fetch(`/api/planning/${pollId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete poll');

    loadAdminPolls();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}
