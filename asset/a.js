  let withdrawState = {
            balance: 0,
            available: 0,
            withdrawn: 0,
            history: []
        };
        
        // 提现限制金额
        const WITHDRAW_LIMIT = 100;

        // 初始化页面
        document.addEventListener('DOMContentLoaded', function() {
            // 从本地存储加载数据
            loadWithdrawData();
            
            // 设置事件监听器
            document.getElementById('submitWithdraw').addEventListener('click', showWithdrawModal);
            document.getElementById('withdrawAmount').addEventListener('input', validateWithdrawAmount);
            document.getElementById('closeModal').addEventListener('click', closeModal);
            document.getElementById('cancelWithdraw').addEventListener('click', closeModal);
            document.getElementById('confirmWithdraw').addEventListener('click', confirmWithdraw);
            
            // 点击弹窗外部关闭弹窗
            document.getElementById('withdrawModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal();
                }
            });
            
            // 更新界面
            updateWithdrawUI();
        });
        
        // 从本地存储加载数据
        function loadWithdrawData() {
            // 尝试从主应用加载数据
            const mainAppState = localStorage.getItem('iframeManagerState');
            if (mainAppState) {
                const parsedState = JSON.parse(mainAppState);
                withdrawState.balance = parsedState.totalEarnings || 0;
                withdrawState.available = parsedState.totalEarnings || 0;
            }
            
            // 加载提现历史
            const withdrawHistory = localStorage.getItem('withdrawHistory');
            if (withdrawHistory) {
                withdrawState.history = JSON.parse(withdrawHistory);
                
                // 计算已提现金额
                withdrawState.withdrawn = withdrawState.history
                    .filter(record => record.status === 'completed')
                    .reduce((sum, record) => sum + record.amount, 0);
                
                // 更新可用余额
                withdrawState.available = withdrawState.balance - withdrawState.withdrawn;
            }
        }
        
        // 更新提现界面
        function updateWithdrawUI() {
            // 更新余额显示
            document.getElementById('balanceAmount').textContent = `¥${withdrawState.balance.toFixed(2)}`;
            document.getElementById('availableAmount').textContent = `¥${withdrawState.available.toFixed(2)}`;
            document.getElementById('withdrawnAmount').textContent = `¥${withdrawState.withdrawn.toFixed(2)}`;
            
            // 更新提现记录
            updateWithdrawHistory();
            
            // 验证提现金额
            validateWithdrawAmount();
            
            // 更新提现限制提示
            updateWithdrawLimitMessage();
        }
        
        // 更新提现限制提示
        function updateWithdrawLimitMessage() {
            const messageElement = document.getElementById('withdrawLimitMessage');
            const submitBtn = document.getElementById('submitWithdraw');
            
            if (withdrawState.available < WITHDRAW_LIMIT) {
                // 余额不足50元
                const remaining = WITHDRAW_LIMIT - withdrawState.available;
                messageElement.innerHTML = `提现限制：账户余额需满50元才能申请提现。还差¥${remaining.toFixed(2)}`;
                messageElement.className = 'withdraw-limit warning';
                
                // 禁用提现按钮
                submitBtn.disabled = true;
                submitBtn.title = `余额不足${WITHDRAW_LIMIT}元，无法提现`;
            } else {
                // 余额足够
                messageElement.innerHTML = `提现限制：账户余额已满50元，可以申请提现`;
                messageElement.className = 'withdraw-limit success';
                
                // 启用提现按钮（但还需验证具体金额）
                submitBtn.title = '';
                validateWithdrawAmount();
            }
        }
        
        // 验证提现金额
        function validateWithdrawAmount() {
            const amountInput = document.getElementById('withdrawAmount');
            const submitBtn = document.getElementById('submitWithdraw');
            const amount = parseFloat(amountInput.value) || 0;
            
            // 首先检查是否满足最低提现限制
            if (withdrawState.available < WITHDRAW_LIMIT) {
                submitBtn.disabled = true;
                return false;
            }
            
            // 然后检查具体金额
            if (amount <= 0) {
                submitBtn.disabled = true;
                return false;
            }
            
            if (amount > withdrawState.available) {
                submitBtn.disabled = true;
                return false;
            }
            
            submitBtn.disabled = false;
            return true;
        }
        
        // 显示提现确认弹窗
        function showWithdrawModal() {
            const amount = parseFloat(document.getElementById('withdrawAmount').value);
            const method = document.getElementById('withdrawMethod').value;
            const accountInfo = document.getElementById('accountInfo').value.trim();
            
            // 验证输入
            if (!validateWithdrawAmount()) {
                if (withdrawState.available < WITHDRAW_LIMIT) {
                    showNotification(`提现金额需满${WITHDRAW_LIMIT}元才能申请提现`, true);
                } else {
                    showNotification('提现金额无效', true);
                }
                return;
            }
            
            if (!accountInfo) {
                showNotification('请输入账户信息', true);
                return;
            }
            
            // 更新弹窗内容
            document.getElementById('modalAmount').textContent = `¥${amount.toFixed(2)}`;
            
            let methodText = '';
            switch(method) {
                case 'alipay':
                    methodText = '支付宝';
                    break;
                case 'wechat':
                    methodText = '微信支付';
                    break;
                case 'bank':
                    methodText = '银行卡';
                    break;
            }
            document.getElementById('modalMethod').textContent = methodText;
            document.getElementById('modalAccount').textContent = accountInfo;
            
            // 显示弹窗
            document.getElementById('withdrawModal').style.display = 'flex';
        }
        
        // 关闭弹窗
        function closeModal() {
            document.getElementById('withdrawModal').style.display = 'none';
        }
        
        // 确认提现
        function confirmWithdraw() {
            const amount = parseFloat(document.getElementById('withdrawAmount').value);
            const method = document.getElementById('withdrawMethod').value;
            const accountInfo = document.getElementById('accountInfo').value.trim();
            
            // 创建提现记录
            const withdrawRecord = {
                id: Date.now(),
                amount: amount,
                method: method,
                accountInfo: accountInfo,
                status: 'pending',
                date: new Date().toLocaleString('zh-CN')
            };
            
            // 添加到历史记录
            withdrawState.history.unshift(withdrawRecord);
            
            // 保存到本地存储
            localStorage.setItem('withdrawHistory', JSON.stringify(withdrawState.history));
            
            // 更新界面
            updateWithdrawUI();
            
            // 清空表单
            document.getElementById('withdrawAmount').value = '';
            document.getElementById('accountInfo').value = '';
            
            // 关闭弹窗
            closeModal();
            
            // 显示成功消息
            showNotification('提现申请已提交，正在处理中');
        }
        
        // 更新提现记录显示
        function updateWithdrawHistory() {
            const historyList = document.getElementById('historyList');
            
            if (withdrawState.history.length === 0) {
                historyList.innerHTML = `
                    <div class="empty-history">
                        <h3>暂无提现记录</h3>
                        <p>提交提现申请后，记录将显示在这里</p>
                    </div>
                `;
                return;
            }
            
            let historyHTML = '';
            
            withdrawState.history.forEach(record => {
                let statusClass = '';
                let statusText = '';
                
                switch(record.status) {
                    case 'pending':
                        statusClass = 'status-pending';
                        statusText = '处理中';
                        break;
                    case 'completed':
                        statusClass = 'status-completed';
                        statusText = '已完成';
                        break;
                    case 'failed':
                        statusClass = 'status-failed';
                        statusText = '失败';
                        break;
                }
                
                let methodText = '';
                switch(record.method) {
                    case 'alipay':
                        methodText = '支付宝';
                        break;
                    case 'wechat':
                        methodText = '微信支付';
                        break;
                    case 'bank':
                        methodText = '银行卡';
                        break;
                }
                
                historyHTML += `
                    <div class="history-item">
                        <div class="history-info">
                            <div class="history-amount">¥${record.amount.toFixed(2)}</div>
                            <div class="history-date">${record.date} · ${methodText}</div>
                        </div>
                        <div class="history-status ${statusClass}">${statusText}</div>
                    </div>
                `;
            });
            
            historyList.innerHTML = historyHTML;
        }
        
        // 显示通知
        function showNotification(message, isError = false) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = isError ? 'notification error' : 'notification';
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }