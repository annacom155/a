   const cardKeys = [
            "LINUX-SERVER-2023-ABCDEF",
            "EMBEDDED-LINUX-2023-XYZ123",
            "LINUX-MANAGER-2023-QWERTY",
            "SERVER-KEY-2023-PASSWORD",
            "LINUX-ADMIN-2023-SECRET"
        ];

        // 万能卡密
        const universalKey = "admin";

        // 应用状态
        let state = {
            iframeCount: 0,
            activeFrameCount: 0,
            adViewCount: 0.00,
            todayCount: 0.00,
            totalEarnings: 0.00,
            isFirstLoad: true,
            usedKeys: [],
            universalKeyUsed: false,  // 标记万能卡密是否已使用
            serverStates: []  // 存储每个服务器的状态：active或pending
        };

        // 计时器和倒计时相关
        let timer = null;
        let countdownTimer = null;
        let countdownTime = 19;
        
        // 初始化应用
        document.addEventListener('DOMContentLoaded', function() {
            // 从本地存储加载数据
            loadState();
            
            // 设置事件监听器
            document.getElementById('addIframe').addEventListener('click', showKeyModal);
            document.getElementById('removeAll').addEventListener('click', removeAllFrames);
            document.getElementById('submitKey').addEventListener('click', validateAndAddIframe);
            document.getElementById('cancelKey').addEventListener('click', hideKeyModal);
            document.getElementById('keyInput').addEventListener('input', clearKeyStatus);
            
            // 恢复服务器状态
            restoreServerStates();
            
            // 更新界面
            updateUI();
            
            // 启动计数（如果有生效的Linux服务器）
            updateCounterSpeed();
            
            // 显示通知
            if (!state.isFirstLoad) {
                showNotification('已从本地存储恢复数据');
            }
            
            // 更新首次使用提示
            updateFirstTimeNote();
            
            // 标记为非首次加载
            state.isFirstLoad = false;
            saveState();
        });
        
        // 从本地存储加载状态
        function loadState() {
            const savedState = localStorage.getItem('iframeManagerState');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                state.iframeCount = parsedState.iframeCount || 0;
                state.activeFrameCount = parsedState.activeFrameCount || 0;
                state.adViewCount = parsedState.adViewCount || 0;
                state.todayCount = parsedState.todayCount || 0;
                state.totalEarnings = parsedState.totalEarnings || 0;
                state.isFirstLoad = parsedState.isFirstLoad !== undefined ? parsedState.isFirstLoad : true;
                state.usedKeys = parsedState.usedKeys || [];
                state.universalKeyUsed = parsedState.universalKeyUsed || false;
                state.serverStates = parsedState.serverStates || [];
            }
        }
        
        // 保存状态到本地存储
        function saveState() {
            localStorage.setItem('iframeManagerState', JSON.stringify(state));
        }
        
        // 恢复服务器状态
        function restoreServerStates() {
            if (state.iframeCount > 0) {
                for (let i = 0; i < state.iframeCount; i++) {
                    const isActive = i < state.activeFrameCount;
                    createIframeElement(i + 1, isActive, true);
                }
                
                // 如果有等待中的服务器，启动倒计时
                if (state.activeFrameCount < state.iframeCount) {
                    startCountdown();
                }
            }
        }
        
        // 更新首次使用提示
        function updateFirstTimeNote() {
            const firstTimeNote = document.getElementById('firstTimeNote');
            if (state.universalKeyUsed) {
                firstTimeNote.style.display = 'none';
            } else {
                firstTimeNote.style.display = 'block';
            }
        }
        
        // 显示卡密验证模态框
        function showKeyModal() {
            document.getElementById('keyModal').style.display = 'flex';
            document.getElementById('keyInput').value = '';
            clearKeyStatus();
            document.getElementById('keyInput').focus();
        }
        
        // 隐藏卡密验证模态框
        function hideKeyModal() {
            document.getElementById('keyModal').style.display = 'none';
        }
        
        // 清除卡密状态信息
        function clearKeyStatus() {
            const keyStatus = document.getElementById('keyStatus');
            keyStatus.style.display = 'none';
            keyStatus.className = 'key-status';
        }
        
        // 验证卡密并添加Linux服务器
        function validateAndAddIframe() {
            const keyInput = document.getElementById('keyInput');
            const keyValue = keyInput.value.trim();
            const keyStatus = document.getElementById('keyStatus');
            
            if (!keyValue) {
                keyStatus.textContent = '请输入卡密';
                keyStatus.className = 'key-status key-invalid';
                keyStatus.style.display = 'block';
                return;
            }
            
            // 检查卡密是否已使用
            if (state.usedKeys.includes(keyValue)) {
                keyStatus.textContent = '此卡密已被使用';
                keyStatus.className = 'key-status key-invalid';
                keyStatus.style.display = 'block';
                return;
            }
            
            // 检查是否为万能卡密
            if (keyValue === universalKey) {
                if (state.universalKeyUsed) {
                    keyStatus.textContent = '万能卡密只能使用一次';
                    keyStatus.className = 'key-status key-invalid';
                    keyStatus.style.display = 'block';
                    return;
                } else {
                    // 万能卡密有效
                    keyStatus.textContent = '万能卡密验证成功！';
                    keyStatus.className = 'key-status key-valid';
                    keyStatus.style.display = 'block';
                    
                    // 标记万能卡密已使用
                    state.universalKeyUsed = true;
                    state.usedKeys.push(universalKey);
                    
                    // 延迟添加Linux服务器，让用户看到成功消息
                    setTimeout(() => {
                        hideKeyModal();
                        addIframe();
                        updateFirstTimeNote();
                    }, 1000);
                    
                    saveState();
                    return;
                }
            }
            
            // 验证普通卡密有效性
            if (cardKeys.includes(keyValue)) {
                // 卡密有效
                keyStatus.textContent = '卡密验证成功！';
                keyStatus.className = 'key-status key-valid';
                keyStatus.style.display = 'block';
                
                // 添加已使用的卡密到状态
                state.usedKeys.push(keyValue);
                
                // 延迟添加Linux服务器，让用户看到成功消息
                setTimeout(() => {
                    hideKeyModal();
                    addIframe();
                }, 1000);
                
                saveState();
            } else {
                // 卡密无效
                keyStatus.textContent = '卡密无效，请检查后重试';
                keyStatus.className = 'key-status key-invalid';
                keyStatus.style.display = 'block';
            }
        }
        
        // 显示通知
        function showNotification(message) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }
        
        // 添加Linux服务器
        function addIframe() {
            state.iframeCount++;
            state.serverStates.push('pending'); // 新服务器初始状态为等待中
            
            // 创建Linux服务器元素
            createIframeElement(state.iframeCount, false, false);
            
            // 启动倒计时（如果是第一个Linux服务器）
            if (state.iframeCount === 1) {
                startCountdown();
            }
            
            // 更新UI和保存状态
            updateUI();
            saveState();
            showNotification('Linux服务器已添加');
        }
        
        // 创建Linux服务器元素
        function createIframeElement(index, isActive, isRestore) {
            const iframeContainer = document.getElementById('iframeContainer');
            
            // 隐藏空状态
            const emptyState = document.getElementById('emptyState');
            if (emptyState) emptyState.style.display = 'none';
            
            const iframeItem = document.createElement('div');
            iframeItem.className = 'iframe-item';
            iframeItem.innerHTML = `
                <div class="iframe-header">
                    <span>
                        Linux服务器 ${index} 
                        ${!isActive ? `<span class="countdown" id="frameCountdown-${index}">${countdownTime}s</span>` : ''}
                    </span>
                    <button class="btn-danger" style="padding: 5px 10px; font-size: 12px;">
                        <i class="fas fa-times"></i> 移除
                    </button>
                </div>
                <div class="iframe-content">
                    <iframe src="${isActive ? '/a/a.html' : '/b/index.html'}"></iframe>
                </div>
            `;
            
            iframeContainer.appendChild(iframeItem);
            
            // 添加移除按钮事件
            iframeItem.querySelector('button').addEventListener('click', function() {
                iframeItem.remove();
                state.iframeCount--;
                
                // 更新服务器状态数组
                state.serverStates.splice(index-1, 1);
                
                // 如果移除的是已生效的Linux服务器
                if (index <= state.activeFrameCount) {
                    state.activeFrameCount--;
                }
                
                // 如果没有Linux服务器了，显示空状态
                if (state.iframeCount === 0) {
                    showEmptyState();
                    clearCountdown();
                }
                
                updateUI();
                updateCounterSpeed();
                saveState();
            });
            
            // 如果是恢复状态且服务器是激活的，直接使用/a/a.html
            if (isRestore && isActive) {
                iframeItem.querySelector('iframe').src = '/a/a.html';
            }
        }
        
        // 启动倒计时
        function startCountdown() {
            // 显示倒计时信息
            document.getElementById('delayInfo').style.display = 'block';
            
            // 显示所有Linux服务器的倒计时
            for (let i = state.activeFrameCount + 1; i <= state.iframeCount; i++) {
                const countdownElement = document.getElementById(`frameCountdown-${i}`);
                if (countdownElement) {
                    countdownElement.style.display = 'inline';
                }
            }
            
            // 清除现有倒计时
            if (countdownTimer) {
                clearInterval(countdownTimer);
            }
            
            countdownTime = 19;
            updateCountdownDisplay();
            
            countdownTimer = setInterval(function() {
                countdownTime--;
                updateCountdownDisplay();
                
                if (countdownTime <= 0) {
                    clearInterval(countdownTimer);
                    countdownTimer = null;
                    
                    // 倒计时结束，激活所有Linux服务器
                    state.activeFrameCount = state.iframeCount;
                    
                    // 更新所有服务器状态为active
                    for (let i = 0; i < state.serverStates.length; i++) {
                        state.serverStates[i] = 'active';
                    }
                    
                    updateCounterSpeed();
                    
                    // 隐藏倒计时信息
                    document.getElementById('delayInfo').style.display = 'none';
                    
                    // 隐藏所有Linux服务器的倒计时并更新iframe源
                    for (let i = 1; i <= state.iframeCount; i++) {
                        const countdownElement = document.getElementById(`frameCountdown-${i}`);
                        if (countdownElement) {
                            countdownElement.style.display = 'none';
                        }
                        
                        // 更新iframe源为/a/a.html
                        const iframe = document.querySelector(`.iframe-item:nth-child(${i}) iframe`);
                        if (iframe) {
                            iframe.src = '/a/a.html';
                        }
                    }
                    
                    updateUI();
                    saveState();
                    showNotification('所有Linux服务器已生效，计数速度已提升');
                }
            }, 1000);
        }
        
        // 更新倒计时显示
        function updateCountdownDisplay() {
            document.getElementById('countdown').textContent = countdownTime;
            
            // 更新所有Linux服务器的倒计时显示
            for (let i = state.activeFrameCount + 1; i <= state.iframeCount; i++) {
                const countdownElement = document.getElementById(`frameCountdown-${i}`);
                if (countdownElement) {
                    countdownElement.textContent = `${countdownTime}s`;
                }
            }
        }
        
        // 清除倒计时
        function clearCountdown() {
            if (countdownTimer) {
                clearInterval(countdownTimer);
                countdownTimer = null;
            }
            document.getElementById('delayInfo').style.display = 'none';
        }
        
        // 显示空状态
        function showEmptyState() {
            const iframeContainer = document.getElementById('iframeContainer');
            iframeContainer.innerHTML = `
                <div class="empty-state" id="emptyState">
                    <i class="fas fa-server"></i>
                    <h3>暂无嵌入式Linux服务器</h3>
                    <p>点击"添加嵌入式Linux服务器"按钮开始添加</p>
                </div>
            `;
            
            // 禁用移除所有按钮
            document.getElementById('removeAll').disabled = true;
        }
        
        // 移除所有Linux服务器
        function removeAllFrames() {
            if (confirm('确定要移除所有Linux服务器吗？')) {
                const iframeContainer = document.getElementById('iframeContainer');
                iframeContainer.innerHTML = '';
                
                state.iframeCount = 0;
                state.activeFrameCount = 0;
                state.serverStates = [];
                
                updateUI();
                updateCounterSpeed();
                showEmptyState();
                clearCountdown();
                saveState();
                showNotification('所有Linux服务器已移除');
            }
        }
        
        // 更新UI
        function updateUI() {
            document.getElementById('frameCount').textContent = state.iframeCount;
            document.getElementById('activeFrames').textContent = state.activeFrameCount;
            document.getElementById('pendingFrames').textContent = state.iframeCount - state.activeFrameCount;
            document.getElementById('adViewCount').textContent = state.adViewCount;
            document.getElementById('todayCount').textContent = state.todayCount;
            document.getElementById('totalEarnings').textContent = `¥${state.totalEarnings.toFixed(2)}`;
            
            // 启用/禁用移除所有按钮
            document.getElementById('removeAll').disabled = state.iframeCount === 0;
        }
        
        // 更新计数速度
        function updateCounterSpeed() {
            // 清除现有计时器
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            
            // 如果没有生效的Linux服务器，不启动计时器
            if (state.activeFrameCount === 0) {
                updateSpeedDisplay(0);
                return;
            }
            
            // 根据生效的Linux服务器数量计算间隔时间
            const interval = Math.max(1000, 10000 / state.activeFrameCount);
            
            // 计算速度（次/秒）
            const speed = 1000 / interval;
            
            // 启动新计时器
            timer = setInterval(function() {
                state.adViewCount++;
                state.todayCount++;
                state.totalEarnings = state.adViewCount * 0.2;
                updateUI();
                saveState();
            }, interval);
            
            updateSpeedDisplay(speed);
        }
        
        // 更新速度显示
        function updateSpeedDisplay(speed) {
            document.getElementById('speedText').textContent = speed.toFixed(2);
            
            // 更新速度条（最大速度设为10次/秒）
            const maxSpeed = 10;
            const speedPercent = Math.min(100, (speed / maxSpeed) * 100);
            document.getElementById('speedBar').style.width = speedPercent + '%';
            document.getElementById('speedValue').textContent = speedPercent.toFixed(0) + '%';
        }