$path = '07_SaaS_Workstation/purchase-order/order-management/hotel-order/pages/detail/side-drawer.html'
$content = Get-Content -Path $path -Raw

$content = $content -replace [regex]::Escape('    .task-tab-list { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }`r`n    .task-tab-btn { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; min-width: 250px; padding: 10px 12px; border: 1px solid var(--color-border-1); border-radius: 7px; background: #fff; color: var(--color-text-2); cursor: pointer; }`r`n    .task-tab-btn.active { border-color: rgba(22, 93, 255, .28); background: rgba(22, 93, 255, .04); box-shadow: inset 0 0 0 1px rgba(22, 93, 255, .08); }`r`n    .task-tab-title { font-size: 14px; font-weight: 600; color: var(--color-text-1); }`r`n    .task-tab-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }`r`n    .task-tab-time { color: var(--color-text-3); font-size: 12px; }`r`n    .purchase-task-panel { display: none; }`r`n    .purchase-task-panel.active { display: block; }`r`n'),'    .view-switch { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }`r`n    .view-card { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; min-width: 220px; padding: 10px 12px; border: 1px solid var(--color-border-1); border-radius: 7px; background: #fff; color: var(--color-text-2); cursor: pointer; }`r`n    .view-card.active { border-color: rgba(22, 93, 255, .28); background: rgba(22, 93, 255, .04); box-shadow: inset 0 0 0 1px rgba(22, 93, 255, .08); }`r`n    .view-card-top { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px; }`r`n    .view-card-title { font-size: 14px; font-weight: 600; color: var(--color-text-1); }`r`n    .view-card-stats { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; }`r`n    .view-stat { font-size: 12px; line-height: 18px; }`r`n    .view-stat-success { color: var(--color-success); }`r`n    .view-stat-fail { color: var(--color-danger); }`r`n    .view-card-meta { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px; color: var(--color-text-3); font-size: 12px; }`r`n    .view-room-count { color: var(--color-text-2); }`r`n    .purchase-task-panel { display: block; }`r`n    .purchase-task-panel.active { display: block; }`r`n'

$oldCss = @'
    .purchase-order-list { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
    .purchase-order-item { border: 1px solid var(--color-border-2); border-radius: 7px; background: #fff; padding: 12px 14px; }
    .purchase-order-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    .purchase-order-title-wrap { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
    .purchase-order-title { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .purchase-order-no { font-size: 14px; font-weight: 600; color: var(--color-text-1); }
    .purchase-upgrade-tags { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .purchase-detail-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px 20px; margin-top: 12px; }
    .purchase-detail-item { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .purchase-detail-item.span-2 { grid-column: span 2; }
    .purchase-detail-item.full { grid-column: 1 / -1; }
    .purchase-detail-label { color: var(--color-text-3); font-size: 13px; line-height: 22px; flex: 0 0 auto; }
    .purchase-detail-value { color: var(--color-text-1); font-size: 14px; line-height: 22px; word-break: break-word; min-width: 0; }
    .purchase-reason-box { margin-top: 12px; padding: 10px 12px; border-radius: 7px; background: #fff7f7; border: 1px solid rgba(245, 63, 63, .14); display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .purchase-reason-content { min-width: 0; flex: 1; }
    .purchase-reason-title { color: var(--color-danger); font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    .purchase-reason-text { color: var(--color-text-1); font-size: 14px; line-height: 1.6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .purchase-more { display: inline-block; }
    .purchase-more summary { list-style: none; cursor: pointer; color: var(--color-primary); font-size: 14px; line-height: 22px; }
    .purchase-more summary::-webkit-details-marker { display: none; }
    .purchase-more-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px 20px; margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--color-border-1); }
  .purchase-more-grid .purchase-detail-item { grid-template-columns: 70px minmax(0, 1fr); align-items: center; }
  .purchase-more-grid .purchase-detail-item.no-label { grid-template-columns: minmax(0, 1fr); }
    .purchase-order-cell { font-size: 13px; color: var(--color-text-2); }
    .purchase-order-cell.strong { color: var(--color-text-1); font-weight: 600; }
    .purchase-detail-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px 20px; margin-top: 12px; }
    .purchase-detail-item { display: grid; grid-template-columns: 70px minmax(0, 1fr); align-items: center; gap: 8px; min-width: 0; }
    .purchase-detail-item.span-2 { grid-column: span 2; }
    .purchase-detail-item.no-label { grid-template-columns: minmax(0, 1fr); }
    .purchase-detail-label { color: var(--color-text-3); font-size: 13px; line-height: 22px; margin-bottom: 0; }
    .purchase-detail-value { color: var(--color-text-1); font-size: 14px; line-height: 22px; word-break: break-word; min-width: 0; }
    .purchase-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }

    .purchase-actions .btn { min-width: auto; padding: 0 12px; height: 32px; }
'@
$newCss = @'
    .purchase-order-list { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
    .purchase-order-item { border: 1px solid var(--color-border-2); border-radius: 7px; background: #fff; padding: 12px 14px; }
    .purchase-order-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    .purchase-order-title-wrap { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
    .purchase-order-title { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .purchase-order-no { font-size: 14px; font-weight: 600; color: var(--color-text-1); }
    .purchase-upgrade-tags { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .purchase-order-main { display: grid; grid-template-columns: minmax(0, 1fr) 180px; gap: 16px; align-items: start; margin-top: 12px; }
    .purchase-detail-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px 20px; }
    .purchase-detail-item { display: grid; grid-template-columns: 70px minmax(0, 1fr); align-items: center; gap: 8px; min-width: 0; }
    .purchase-detail-item.span-2 { grid-column: span 2; }
    .purchase-detail-item.full { grid-column: 1 / -1; }
    .purchase-detail-item.no-label { grid-template-columns: minmax(0, 1fr); grid-column: 1 / -1; }
    .purchase-detail-label { color: var(--color-text-3); font-size: 13px; line-height: 22px; margin-bottom: 0; }
    .purchase-detail-value { color: var(--color-text-1); font-size: 14px; line-height: 22px; word-break: break-word; min-width: 0; }
    .purchase-order-side { padding-left: 16px; border-left: 1px solid var(--color-border-1); }
    .purchase-amount-label { color: var(--color-text-3); font-size: 12px; line-height: 20px; }
    .purchase-amount-value { margin-top: 4px; color: var(--color-danger); font-size: 22px; font-weight: 700; line-height: 1.2; }
    .purchase-price-detail { margin-top: 10px; }
    .purchase-price-detail summary { list-style: none; cursor: pointer; color: var(--color-primary); font-size: 13px; }
    .purchase-price-detail summary::-webkit-details-marker { display: none; }
    .purchase-price-list { display: grid; gap: 8px; margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--color-border-1); }
    .purchase-reason-box { margin-top: 12px; padding: 10px 12px; border-radius: 7px; background: #fff7f7; border: 1px solid rgba(245, 63, 63, .14); display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .purchase-reason-content { min-width: 0; flex: 1; }
    .purchase-reason-title { color: var(--color-danger); font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    .purchase-reason-text { color: var(--color-text-1); font-size: 14px; line-height: 1.6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .purchase-more { display: inline-block; }
    .purchase-more summary { list-style: none; cursor: pointer; color: var(--color-primary); font-size: 14px; line-height: 22px; }
    .purchase-more summary::-webkit-details-marker { display: none; }
    .purchase-more-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px 20px; margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--color-border-1); }
    .purchase-more-grid .purchase-detail-item { display: grid; grid-template-columns: 70px minmax(0, 1fr); align-items: start; gap: 8px; width: 100%; }
    .purchase-more-grid .purchase-detail-item.no-label { grid-template-columns: minmax(0, 1fr); }
    .purchase-order-cell { font-size: 13px; color: var(--color-text-2); }
    .purchase-order-cell.strong { color: var(--color-text-1); font-weight: 600; }
    .purchase-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; width: 260px; padding-left: 16px; }
    .purchase-actions .btn { min-width: auto; padding: 0 12px; height: 32px; }
'@
$content = $content.Replace($oldCss,$newCss)

$newSection = @'
                    <div class="view-switch">
              <button class="view-card active" type="button" data-view="all">
                <div class="view-card-top"><span class="view-card-title">全部</span><span class="view-card-stats"><span class="view-stat view-stat-success">成功 4</span><span class="view-stat view-stat-fail">失败 2</span></span></div>
                <div class="view-card-meta"><span class="view-card-meta-main"><span>4月25日-4月29日</span></span><span class="view-room-count">2间</span></div>
              </button>
              <button class="view-card" type="button" data-view="2026-04-25-26">
                <div class="view-card-top"><span class="view-card-title">4月25日-4月26日</span><span class="view-card-stats"><span class="view-stat view-stat-success">成功 1</span><span class="view-stat view-stat-fail">失败 1</span></span></div>
                <div class="view-card-meta"><span class="view-card-meta-main"><span>2026/4/25 20:09</span></span><span class="view-room-count">2间</span></div>
              </button>
              <button class="view-card" type="button" data-view="2026-04-27-29">
                <div class="view-card-top"><span class="view-card-title">4月27日-4月29日</span><span class="view-card-stats"><span class="view-stat view-stat-success">成功 1</span><span class="view-stat view-stat-fail">失败 1</span></span></div>
                <div class="view-card-meta"><span class="view-card-meta-main"><span>2026/4/26 20:11</span></span><span class="view-room-count">2间</span></div>
              </button>
              <button class="view-card" type="button" data-view="2026-04-27-28">
                <div class="view-card-top"><span class="view-card-title">4月27日-4月28日</span><span class="view-card-stats"><span class="view-stat view-stat-success">成功 1</span></span></div>
                <div class="view-card-meta"><span class="view-card-meta-main"><span>2026/4/26 20:19</span></span><span class="view-room-count">1间</span></div>
              </button>
              <button class="view-card" type="button" data-view="2026-04-28-29">
                <div class="view-card-top"><span class="view-card-title">4月28日-4月29日</span><span class="view-card-stats"><span class="view-stat view-stat-success">成功 1</span></span></div>
                <div class="view-card-meta"><span class="view-card-meta-main"><span>2026/4/27 20:11</span></span><span class="view-room-count">1间</span></div>
              </button>
            </div>

            <div class="purchase-task-panel active">
              <div class="purchase-order-list">
                <div class="purchase-order-item" data-view-group="2026-04-25-26">
                  <div class="purchase-order-top">
                    <div class="purchase-order-title-wrap">
                      <div class="purchase-order-title"><span class="source-badge"><span class="source-platform">艺</span><span class="source-channel">艺龙-api</span></span><span class="purchase-order-no">采购单号：PO-20260425-001</span></div>
                    </div>
                    <div class="purchase-actions"><span class="tag tag-gray">已取消</span></div>
                  </div>
                  <div class="purchase-order-main">
                    <div class="purchase-detail-grid">
                      <div class="purchase-detail-item"><div class="purchase-detail-label">房型信息</div><div class="purchase-detail-value">豪华大床房-双早</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">入离时间</div><div class="purchase-detail-value">2026年4月25日 - 2026年4月26日</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">间夜</div><div class="purchase-detail-value">2间 / 1晚</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">入住人</div><div class="purchase-detail-value">张三</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">联系人</div><div class="purchase-detail-value">李四 / 13800000001</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">取消规则</div><div class="purchase-detail-value">入住前1天18:00前可免费取消，之后取消收取首晚房费。</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">创建时间</div><div class="purchase-detail-value">2026-04-25 20:09:12</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">支付时间</div><div class="purchase-detail-value">-</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">取消时间</div><div class="purchase-detail-value">2026-04-25 20:10:07</div></div>
                      <div class="purchase-detail-item no-label"><div class="purchase-detail-value"><details class="purchase-more"><summary>查看更多</summary><div class="purchase-more-grid"><div class="purchase-detail-item"><div class="purchase-detail-label">支付方式</div><div class="purchase-detail-value">企业VCC预付</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">支付流水</div><div class="purchase-detail-value">PAY-PO-20260425-001</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">优惠权益</div><div class="purchase-detail-value">无优惠</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">开票类型</div><div class="purchase-detail-value">酒店开发票</div></div></div></details></div></div>
                    </div>
                    <div class="purchase-order-side"><div class="purchase-amount-label">订单金额</div><div class="purchase-amount-value">¥432.00</div><details class="purchase-price-detail"><summary>价格明细</summary><div class="purchase-price-list"><div class="cost-row"><div class="cost-row-label">订单金额</div><div class="cost-row-value">¥432.00</div></div><div class="cost-row"><div class="cost-row-label">优惠信息</div><div class="cost-row-value">无优惠</div></div><div class="cost-row"><div class="cost-row-label">实付金额</div><div class="cost-row-value emphasis">¥432.00</div></div></div></details></div>
                  </div>
                  <div class="purchase-reason-box"><div class="purchase-reason-content"><div class="purchase-reason-title">失败原因</div><div class="purchase-reason-text">房态不足，渠道返回 ROOM_CLOSED</div></div><button class="btn" data-modal="purchaseFailure" data-failure-detail='{"purchaseOrderNo":"PO-20260425-001","status":"FAILED","code":"ROOM_CLOSED","message":"Room inventory closed","channel":"elong-api","occurredAt":"2026-04-25 20:10:07"}'>查看详情</button></div>
                </div>

                <div class="purchase-order-item" data-view-group="2026-04-25-26">
                  <div class="purchase-order-top">
                    <div class="purchase-order-title-wrap">
                      <div class="purchase-order-title"><span class="source-badge"><span class="source-platform">携</span><span class="source-channel">携程-trip</span></span><span class="purchase-order-no">采购单号：PO-20260425-002</span></div>
                    </div>
                    <div class="purchase-actions"><span class="tag tag-orange">待确认</span></div>
                  </div>
                  <div class="purchase-order-main">
                    <div class="purchase-detail-grid">
                      <div class="purchase-detail-item"><div class="purchase-detail-label">房型信息</div><div class="purchase-detail-value">豪华大床房-双早</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">入离时间</div><div class="purchase-detail-value">2026年4月25日 - 2026年4月26日</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">间夜</div><div class="purchase-detail-value">2间 / 1晚</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">入住人</div><div class="purchase-detail-value">张三</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">联系人</div><div class="purchase-detail-value">李四 / 13800000001</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">取消规则</div><div class="purchase-detail-value">入住前1天18:00前可免费取消，之后取消收取首晚房费。</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">创建时间</div><div class="purchase-detail-value">2026-04-25 20:11:24</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">支付时间</div><div class="purchase-detail-value">2026-04-25 20:11:31</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">取消时间</div><div class="purchase-detail-value">-</div></div>
                      <div class="purchase-detail-item no-label"><div class="purchase-detail-value"><details class="purchase-more"><summary>查看更多</summary><div class="purchase-more-grid"><div class="purchase-detail-item"><div class="purchase-detail-label">支付方式</div><div class="purchase-detail-value">供应商担保支付</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">支付流水</div><div class="purchase-detail-value">PAY-CTRIP-20260425-002</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">优惠权益</div><div class="purchase-detail-value">渠道立减 ¥12 / 早餐升级</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">开票类型</div><div class="purchase-detail-value">携程开发票</div></div></div></details></div></div>
                    </div>
                    <div class="purchase-order-side"><div class="purchase-amount-label">订单金额</div><div class="purchase-amount-value">¥428.00</div><details class="purchase-price-detail"><summary>价格明细</summary><div class="purchase-price-list"><div class="cost-row"><div class="cost-row-label">订单金额</div><div class="cost-row-value">¥440.00</div></div><div class="cost-row"><div class="cost-row-label">优惠信息</div><div class="cost-row-value">渠道立减 ¥12 / 早餐升级</div></div><div class="cost-row"><div class="cost-row-label">实付金额</div><div class="cost-row-value emphasis">¥428.00</div></div></div></details></div>
                  </div>
                </div>

                <div class="purchase-order-item" data-view-group="2026-04-27-29">
                  <div class="purchase-order-top">
                    <div class="purchase-order-title-wrap">
                      <div class="purchase-order-title"><span class="source-badge"><span class="source-platform">艺</span><span class="source-channel">艺龙-api</span></span><span class="purchase-order-no">采购单号：PO-20260426-001</span></div>
                    </div>
                    <div class="purchase-actions"><span class="tag tag-gray">已取消</span></div>
                  </div>
                  <div class="purchase-order-main">
                    <div class="purchase-detail-grid">
                      <div class="purchase-detail-item"><div class="purchase-detail-label">房型信息</div><div class="purchase-detail-value">行政双床房-双早</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">入离时间</div><div class="purchase-detail-value">2026年4月27日 - 2026年4月29日</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">间夜</div><div class="purchase-detail-value">1间 / 2晚</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">入住人</div><div class="purchase-detail-value">张三</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">联系人</div><div class="purchase-detail-value">李四 / 13800000001</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">取消规则</div><div class="purchase-detail-value">不可免费取消，取消将按订单实付金额收取罚金。</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">创建时间</div><div class="purchase-detail-value">2026-04-26 20:11:08</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">支付时间</div><div class="purchase-detail-value">-</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">取消时间</div><div class="purchase-detail-value">2026-04-26 20:12:09</div></div>
                      <div class="purchase-detail-item no-label"><div class="purchase-detail-value"><details class="purchase-more"><summary>查看更多</summary><div class="purchase-more-grid"><div class="purchase-detail-item"><div class="purchase-detail-label">支付方式</div><div class="purchase-detail-value">企业VCC预付</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">支付流水</div><div class="purchase-detail-value">PAY-PO-20260425-001</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">优惠权益</div><div class="purchase-detail-value">无优惠</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">开票类型</div><div class="purchase-detail-value">酒店开发票</div></div></div></details></div></div>
                    </div>
                    <div class="purchase-order-side"><div class="purchase-amount-label">订单金额</div><div class="purchase-amount-value">¥648.00</div><details class="purchase-price-detail"><summary>价格明细</summary><div class="purchase-price-list"><div class="cost-row"><div class="cost-row-label">订单金额</div><div class="cost-row-value">¥648.00</div></div><div class="cost-row"><div class="cost-row-label">优惠信息</div><div class="cost-row-value">无优惠</div></div><div class="cost-row"><div class="cost-row-label">实付金额</div><div class="cost-row-value emphasis">¥648.00</div></div></div></details></div>
                  </div>
                  <div class="purchase-reason-box"><div class="purchase-reason-content"><div class="purchase-reason-title">失败原因</div><div class="purchase-reason-text">价格超限，渠道返回 PRICE_LIMIT。</div></div><button class="btn" data-modal="purchaseFailure" data-failure-detail='{"purchaseOrderNo":"PO-20260426-001","status":"FAILED","code":"PRICE_LIMIT","message":"Price exceeded threshold by 12%","channel":"elong-api","occurredAt":"2026-04-26 20:12:09"}'>查看详情</button></div>
                </div>

                <div class="purchase-order-item" data-view-group="2026-04-27-29">
                  <div class="purchase-order-top">
                    <div class="purchase-order-title-wrap">
                      <div class="purchase-order-title"><span class="source-badge"><span class="source-platform">携</span><span class="source-channel">携程-trip</span></span><span class="purchase-order-no">采购单号：PO-20260426-003</span></div>
                    </div>
                    <div class="purchase-actions"><span class="tag tag-blue">待入住</span></div>
                  </div>
                  <div class="purchase-order-main">
                    <div class="purchase-detail-grid">
                      <div class="purchase-detail-item"><div class="purchase-detail-label">房型信息</div><div class="purchase-detail-value">行政双床房-双早</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">入离时间</div><div class="purchase-detail-value">2026年4月27日 - 2026年4月29日</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">间夜</div><div class="purchase-detail-value">1间 / 2晚</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">入住人</div><div class="purchase-detail-value">张三</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">联系人</div><div class="purchase-detail-value">李四 / 13800000001</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">取消规则</div><div class="purchase-detail-value">不可免费取消，取消将按订单实付金额收取罚金。</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">创建时间</div><div class="purchase-detail-value">2026-04-26 20:13:18</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">支付时间</div><div class="purchase-detail-value">2026-04-26 20:13:29</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">取消时间</div><div class="purchase-detail-value">-</div></div>
                      <div class="purchase-detail-item no-label"><div class="purchase-detail-value"><details class="purchase-more"><summary>查看更多</summary><div class="purchase-more-grid"><div class="purchase-detail-item"><div class="purchase-detail-label">支付方式</div><div class="purchase-detail-value">供应商担保支付</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">支付流水</div><div class="purchase-detail-value">PAY-CTRIP-20260426-003</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">优惠权益</div><div class="purchase-detail-value">无优惠</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">开票类型</div><div class="purchase-detail-value">携程开发票</div></div></div></details></div></div>
                    </div>
                    <div class="purchase-order-side"><div class="purchase-amount-label">订单金额</div><div class="purchase-amount-value">¥652.00</div><details class="purchase-price-detail"><summary>价格明细</summary><div class="purchase-price-list"><div class="cost-row"><div class="cost-row-label">订单金额</div><div class="cost-row-value">¥652.00</div></div><div class="cost-row"><div class="cost-row-label">优惠信息</div><div class="cost-row-value">无优惠</div></div><div class="cost-row"><div class="cost-row-label">实付金额</div><div class="cost-row-value emphasis">¥652.00</div></div></div></details></div>
                  </div>
                </div>

                <div class="purchase-order-item" data-view-group="2026-04-27-28">
                  <div class="purchase-order-top">
                    <div class="purchase-order-title-wrap">
                      <div class="purchase-order-title"><span class="source-badge"><span class="source-platform">携</span><span class="source-channel">携程-trip</span></span><span class="purchase-order-no">采购单号：PO-20260426-002</span></div>
                    </div>
                    <div class="purchase-actions"><span class="tag tag-green">已入住</span></div>
                  </div>
                  <div class="purchase-order-main">
                    <div class="purchase-detail-grid">
                      <div class="purchase-detail-item"><div class="purchase-detail-label">房型信息</div><div class="purchase-detail-value">行政双床房-双早</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">入离时间</div><div class="purchase-detail-value">2026年4月27日 - 2026年4月28日</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">间夜</div><div class="purchase-detail-value">1间 / 1晚</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">入住人</div><div class="purchase-detail-value">张三</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">联系人</div><div class="purchase-detail-value">李四 / 13800000001</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">取消规则</div><div class="purchase-detail-value">不可免费取消，取消将按订单实付金额收取罚金。</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">创建时间</div><div class="purchase-detail-value">2026-04-26 20:19:44</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">支付时间</div><div class="purchase-detail-value">2026-04-26 20:20:03</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">取消时间</div><div class="purchase-detail-value">-</div></div>
                      <div class="purchase-detail-item no-label"><div class="purchase-detail-value"><details class="purchase-more"><summary>查看更多</summary><div class="purchase-more-grid"><div class="purchase-detail-item"><div class="purchase-detail-label">支付方式</div><div class="purchase-detail-value">供应商担保支付</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">支付流水</div><div class="purchase-detail-value">PAY-CTRIP-20260425-002</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">优惠权益</div><div class="purchase-detail-value">渠道立减 ¥12 / 早餐升级</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">开票类型</div><div class="purchase-detail-value">携程开发票</div></div></div></details></div></div>
                    </div>
                    <div class="purchase-order-side"><div class="purchase-amount-label">订单金额</div><div class="purchase-amount-value">¥326.00</div><details class="purchase-price-detail"><summary>价格明细</summary><div class="purchase-price-list"><div class="cost-row"><div class="cost-row-label">订单金额</div><div class="cost-row-value">¥338.00</div></div><div class="cost-row"><div class="cost-row-label">优惠信息</div><div class="cost-row-value">渠道立减 ¥12 / 早餐升级</div></div><div class="cost-row"><div class="cost-row-label">实付金额</div><div class="cost-row-value emphasis">¥326.00</div></div></div></details></div>
                  </div>
                </div>

                <div class="purchase-order-item" data-view-group="2026-04-28-29">
                  <div class="purchase-order-top">
                    <div class="purchase-order-title-wrap">
                      <div class="purchase-order-title"><span class="source-badge"><span class="source-platform">艺</span><span class="source-channel">艺龙-api</span></span><span class="purchase-order-no">采购单号：PO-20260427-001</span></div>
                    </div>
                    <div class="purchase-actions"><span class="tag tag-cyan">已离店</span></div>
                  </div>
                  <div class="purchase-order-main">
                    <div class="purchase-detail-grid">
                      <div class="purchase-detail-item"><div class="purchase-detail-label">房型信息</div><div class="purchase-detail-value">行政双床房-双早</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">入离时间</div><div class="purchase-detail-value">2026年4月28日 - 2026年4月29日</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">间夜</div><div class="purchase-detail-value">1间 / 1晚</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">入住人</div><div class="purchase-detail-value">张三</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">联系人</div><div class="purchase-detail-value">李四 / 13800000001</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">取消规则</div><div class="purchase-detail-value">不可免费取消，取消将按订单实付金额收取罚金。</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">创建时间</div><div class="purchase-detail-value">2026-04-27 20:11:17</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">支付时间</div><div class="purchase-detail-value">2026-04-27 20:11:39</div></div>
                      <div class="purchase-detail-item"><div class="purchase-detail-label">取消时间</div><div class="purchase-detail-value">-</div></div>
                      <div class="purchase-detail-item no-label"><div class="purchase-detail-value"><details class="purchase-more"><summary>查看更多</summary><div class="purchase-more-grid"><div class="purchase-detail-item"><div class="purchase-detail-label">支付方式</div><div class="purchase-detail-value">企业VCC预付</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">支付流水</div><div class="purchase-detail-value">PAY-PO-20260425-001</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">优惠权益</div><div class="purchase-detail-value">无优惠</div></div><div class="purchase-detail-item"><div class="purchase-detail-label">开票类型</div><div class="purchase-detail-value">酒店开发票</div></div></div></details></div></div>
                    </div>
                    <div class="purchase-order-side"><div class="purchase-amount-label">订单金额</div><div class="purchase-amount-value">¥328.00</div><details class="purchase-price-detail"><summary>价格明细</summary><div class="purchase-price-list"><div class="cost-row"><div class="cost-row-label">订单金额</div><div class="cost-row-value">¥328.00</div></div><div class="cost-row"><div class="cost-row-label">优惠信息</div><div class="cost-row-value">无优惠</div></div><div class="cost-row"><div class="cost-row-label">实付金额</div><div class="cost-row-value emphasis">¥328.00</div></div></div></details></div>
                  </div>
                </div>
              </div>
            </div>
'@
$content = [regex]::Replace($content,'(?s)\s{20}<div class="task-tab-list">.*?\s{8}</section>',$newSection + "`r`n`r`n        </section>",1)

$content = [regex]::Replace($content,'(?s)<div class="modal-mask" id="purchaseFailureModal">.*?</div>\s*</div>\s*<div class="toast" id="toast"></div>','  <div class="modal-mask" id="purchaseFailureModal">`r`n    <div class="modal">`r`n      <div class="modal-head"><div class="modal-title">采购失败原因明细</div><button class="btn" data-close-modal>关闭</button></div>`r`n      <div class="modal-body"><pre class="json-dialog-pre" id="purchaseFailureContent">{}</pre></div>`r`n    </div>`r`n  </div>`r`n`r`n  <div class="toast" id="toast"></div>',1)

$content = $content -replace [regex]::Escape("    document.querySelectorAll('[data-task-panel]').forEach(btn => btn.addEventListener('click', () => {`r`n      document.querySelectorAll('[data-task-panel]').forEach(el => el.classList.remove('active'));`r`n      document.querySelectorAll('.purchase-task-panel').forEach(panel => panel.classList.remove('active'));`r`n      btn.classList.add('active');`r`n      document.getElementById(btn.dataset.taskPanel).classList.add('active');`r`n    }));"),"    document.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => {`r`n      document.querySelectorAll('[data-view]').forEach(el => el.classList.remove('active'));`r`n      btn.classList.add('active');`r`n      const view = btn.dataset.view;`r`n      document.querySelectorAll('.purchase-order-item[data-view-group]').forEach(item => {`r`n        item.style.display = view === 'all' || item.dataset.viewGroup === view ? '' : 'none';`r`n      });`r`n    }));"

$content = $content -replace [regex]::Escape("    document.querySelectorAll('[data-modal]').forEach(btn => btn.addEventListener('click', () => {`r`n      if (btn.dataset.modal === 'purchaseFailure') document.getElementById('purchaseFailureModal')?.classList.add('show');`r`n    }));"),"    document.querySelectorAll('[data-modal]').forEach(btn => btn.addEventListener('click', () => {`r`n      if (btn.dataset.modal === 'purchaseFailure') {`r`n        const modal = document.getElementById('purchaseFailureModal');`r`n        const contentEl = document.getElementById('purchaseFailureContent');`r`n        if (contentEl) {`r`n          try {`r`n            const detail = btn.dataset.failureDetail ? JSON.parse(btn.dataset.failureDetail) : {};`r`n            contentEl.textContent = JSON.stringify(detail, null, 2);`r`n          } catch {`r`n            contentEl.textContent = '{}';`r`n          }`r`n        }`r`n        modal?.classList.add('show');`r`n      }`r`n    }));"

Set-Content -Path $path -Value $content -Encoding UTF8
