/**
 * 文匠 DocSmith — 场景预设库
 *
 * 每个预设 = 一份完整可跑的 DocSpec JSON + 元信息。
 * Playground 加载后可直接渲染，也是学习「每种文档怎么写」的范例。
 */
import type { DocSpec } from "@/lib/pdf/dsl";

export interface Preset {
  id: string;
  name: string;
  emoji: string;
  /** 一句话场景说明 */
  desc: string;
  /** 演示了哪些 pdfcn 能力 */
  features: string[];
  spec: DocSpec;
}

export const PRESETS: Preset[] = [
  /* ═══════════════ 中文发票 ═══════════════ */
  {
    id: "invoice",
    name: "中文发票",
    emoji: "🧾",
    desc: "税率合计、扫码验真、水印防伪的标准增值税发票版式",
    features: ["KeyValue", "DataTable(含合计行)", "QRCode", "Watermark", "Alert"],
    spec: {
      theme: "modern",
      metadata: { title: "软件服务发票 INV-2026-0909", author: "杭州云链科技有限公司", lang: "zh-CN" },
      page: { size: "a4" },
      footer: { left: "杭州云链科技有限公司 · 开票专用", pageNumbers: true },
      body: [
        { type: "heading", text: "杭 州 云 链 科 技", level: 1 },
        { type: "text", text: "软件研发服务发票 · INV-2026-0909", variant: "sm", color: "mutedForeground" },
        { type: "divider", variant: "dashed" },
        {
          type: "key-value",
          items: [
            { label: "客户名称", value: "上海明眸文化传媒有限公司" },
            { label: "纳税人识别号", value: "91310000MA1FL5XXXX" },
            { label: "开票日期", value: "2026年09月09日" },
            { label: "经办人", value: "赵梦龙" },
          ],
          size: "md",
        },
        {
          type: "data-table",
          columns: [
            { key: "name", header: "项目名称" },
            { key: "spec", header: "规格" },
            { key: "qty", header: "数量", align: "right", width: 60 },
            { key: "price", header: "单价", align: "right", width: 100 },
            { key: "amount", header: "金额", align: "right", width: 110 },
          ],
          rows: [
            { name: "文档生成引擎授权", spec: "企业版 / 年", qty: 1, price: "¥120,000.00", amount: "¥120,000.00" },
            { name: "PDF 模板定制开发", spec: "人天", qty: 24, price: "¥3,200.00", amount: "¥76,800.00" },
            { name: "技术支持服务", spec: "月度", qty: 12, price: "¥2,400.00", amount: "¥28,800.00" },
          ],
          footer: { name: "价税合计（大写：贰拾贰万伍仟陆佰元整）", amount: "¥225,600.00" },
          stripe: true,
        },
        {
          type: "graph",
          variant: "donut",
          title: "费用构成",
          data: [
            { label: "引擎授权", value: 120000 },
            { label: "定制开发", value: 76800 },
            { label: "技术支持", value: 28800 },
          ],
          showValues: true,
          legend: "right",
          height: 200,
        },
        {
          type: "alert",
          variant: "info",
          title: "开票说明",
          text: "本发票由文匠 DocSmith 文档引擎按模板自动生成，票面数据与订单系统一致，可通过下方二维码验真。",
        },
        {
          type: "stack",
          gap: "md",
          children: [
            { type: "qrcode", value: "https://docsmith.cn/verify/INV-2026-0909", size: 92, caption: "扫码验真" },
          ],
        },
        {
          type: "watermark",
          text: "云链科技",
          opacity: 0.05,
          fontSize: 56,
          angle: -30,
        },
      ],
    },
  },

  /* ═══════════════ 财务季度报告 ═══════════════ */
  {
    id: "report-financial",
    name: "财务季度报告",
    emoji: "📈",
    desc: "多图表 + 分节结构的经营分析报告，含书签目录",
    features: ["Graph(bar/line/donut)", "DataTable", "Section", "Badge", "outline 书签"],
    spec: {
      theme: "executive",
      metadata: { title: "2026 Q2 经营分析报告", author: "战略与财务部", lang: "zh-CN" },
      page: { size: "a4" },
      header: { title: "云链科技 · 内部资料", variant: "minimal" },
      footer: { left: "战略与财务部", pageNumbers: true, pageNumberFormat: "cjk-decimal" },
      outline: true,
      body: [
        { type: "heading", text: "2026 年第二季度经营分析", level: 1 },
        { type: "text", text: "报告编号：FN-Q2-2026-07 ｜ 密级：内部", variant: "sm", color: "mutedForeground" },
        { type: "badge", label: "已审计", variant: "success" },
        { type: "divider", label: "核心结论" },
        {
          type: "key-value",
          items: [
            { label: "营业收入", value: "¥8,420 万（同比 +23.6%）", color: "success" },
            { label: "毛利率", value: "61.8%（环比 +2.1pct）" },
            { label: "经营现金流", value: "¥1,240 万", color: "primary" },
            { label: "客户留存率", value: "94.2%" },
          ],
          size: "lg",
        },
        {
          type: "section",
          title: "一、收入结构",
          spacing: "lg",
          children: [
            {
              type: "graph",
              variant: "bar",
              title: "各产品线收入（万元）",
              data: [
                { label: "文档引擎", value: 3260 },
                { label: "智能审阅", value: 2480 },
                { label: "数据服务", value: 1680 },
                { label: "咨询交付", value: 1000 },
              ],
              showValues: true,
              showGrid: true,
              height: 230,
            },
          ],
        },
        {
          type: "section",
          title: "二、增长趋势",
          spacing: "lg",
          children: [
            {
              type: "graph",
              variant: "line",
              title: "近 6 季度营收（万元）",
              data: [
                { label: "Q1'25", value: 5120 },
                { label: "Q2'25", value: 5480 },
                { label: "Q3'25", value: 6150 },
                { label: "Q4'25", value: 6890 },
                { label: "Q1'26", value: 7460 },
                { label: "Q2'26", value: 8420 },
              ],
              smooth: true,
              showDots: true,
              showGrid: true,
              height: 230,
            },
          ],
        },
        {
          type: "section",
          title: "三、费用明细",
          spacing: "lg",
          children: [
            {
              type: "data-table",
              columns: [
                { key: "item", header: "费用科目" },
                { key: "budget", header: "预算(万)", align: "right" },
                { key: "actual", header: "实际(万)", align: "right" },
                { key: "rate", header: "执行率", align: "right" },
              ],
              rows: [
                { item: "研发投入", budget: "2,400", actual: "2,315", rate: "96.5%" },
                { item: "市场推广", budget: "1,200", actual: "1,086", rate: "90.5%" },
                { item: "行政管理", budget: "800", actual: "812", rate: "101.5%" },
              ],
              footer: { item: "合计", budget: "4,400", actual: "4,213", rate: "95.8%" },
              stripe: true,
            },
          ],
        },
        {
          type: "alert",
          variant: "warning",
          title: "风险提示",
          text: "行政管理费用执行率超预算 1.5%，主要系三季度办公室扩租所致，已纳入 Q3 专项管控。",
        },
        { type: "page-break" },
        { type: "heading", text: "四、下季度展望", level: 2 },
        {
          type: "list",
          variant: "checklist",
          items: [
            { text: "文档引擎 3.0 发布：支持 PDF/A-3 电子发票", checked: true },
            { text: "智能审阅接入 5 家头部券商试点", checked: true },
            { text: "启动东南亚市场本地化部署", description: "目标：Q4 签约 3 家标杆客户", checked: false },
            { text: "全年营收目标上调至 3.4 亿", description: "由 3.2 亿上调 6.25%", checked: false },
          ],
        },
        {
          type: "card",
          title: "董事会决议摘要",
          variant: "muted",
          children: [
            { type: "text", text: "经 2026 年 8 月 28 日董事会审议通过本报告，同意按计划推进下季度经营事项。" },
            { type: "signature", variant: "double", signers: [
              { label: "董事长", name: "陈远山", date: "2026-08-28" },
              { label: "财务负责人", name: "林知夏", date: "2026-08-28" },
            ]},
          ],
        },
      ],
    },
  },

  /* ═══════════════ 培训结业证书 ═══════════════ */
  {
    id: "certificate",
    name: "结业证书",
    emoji: "🏅",
    desc: "单页横版证书（viewport 模式），水印 + 双签章",
    features: ["viewport 单页", "Watermark 居中", "Signature", "QRCode"],
    spec: {
      theme: "elegant",
      metadata: { title: "结业证书", lang: "zh-CN" },
      viewport: { width: 1123, height: 794 },
      body: [
        { type: "watermark", text: "CERTIFIED", opacity: 0.05, fontSize: 80, position: "center" },
        {
          type: "stack",
          gap: "md",
          align: "center",
          children: [
            { type: "text", text: "文匠文档学院", variant: "xl", weight: "bold", color: "primary", noMargin: true },
            { type: "heading", text: "结 业 证 书", level: 1, align: "center", noMargin: true },
            { type: "divider", variant: "dotted", color: "primary" },
            { type: "text", text: "兹证明", variant: "base", align: "center", noMargin: true },
            { type: "text", text: "赵 梦 龙", variant: "3xl", weight: "bold", align: "center", color: "primary", noMargin: true },
            {
              type: "text",
              text: "于 2026 年度完成《智能文档工程实战》全部课程与实操考核，成绩优异，准予结业，特发此证。",
              align: "center",
              variant: "base",
            },
            { type: "text", text: "学时 96（含实训 40） · 成绩 92/100 优秀 · 编号 DS-CERT-2026-0912", variant: "sm", color: "mutedForeground", align: "center", noMargin: true },
            { type: "signature", variant: "double", signers: [
              { label: "院长", name: "文小明", date: "2026年9月9日" },
              { label: "教务主任", name: "匠无心", date: "2026年9月9日" },
            ]},
            { type: "qrcode", value: "https://docsmith.cn/verify/DS-CERT-2026-0912", size: 64, caption: "扫码查验证书真伪" },
          ],
        },
      ],
    },
  },

  /* ═══════════════ 热敏小票 ═══════════════ */
  {
    id: "receipt",
    name: "热敏小票",
    emoji: "🧾",
    desc: "302px 宽自适应高度小票（viewport 无界高度模式）",
    features: ["viewport 自适应高度", "DataTable compact", "KeyValue"],
    spec: {
      theme: "minimal",
      metadata: { title: "消费小票", lang: "zh-CN" },
      viewport: { width: 302 },
      body: [
        { type: "text", text: "文匠咖啡 · 西溪园区店", variant: "lg", weight: "bold", align: "center", noMargin: true },
        { type: "text", text: "杭州市余杭区文一西路 969 号", variant: "xs", align: "center", color: "mutedForeground", noMargin: true },
        { type: "divider", variant: "dashed" },
        { type: "key-value", size: "sm", items: [
          { label: "订单号", value: "DS-2609-0912" },
          { label: "收银员", value: "小匠" },
          { label: "时间", value: "2026-09-09 15:42" },
        ]},
        {
          type: "data-table",
          size: "compact",
          variant: "minimal",
          columns: [
            { key: "item", header: "品项" },
            { key: "qty", header: "x", align: "center", width: 24 },
            { key: "amount", header: "金额", align: "right", width: 70 },
          ],
          rows: [
            { item: "燕麦拿铁 大杯", qty: 2, amount: "¥68" },
            { item: "可颂", qty: 1, amount: "¥18" },
            { item: "提拉米苏", qty: 1, amount: "¥32" },
          ],
        },
        { type: "divider", variant: "dashed" },
        { type: "key-value", size: "md", items: [
          { label: "合计", value: "¥118.00", color: "primary" },
          { label: "会员立减", value: "-¥10.00", color: "success" },
          { label: "实付", value: "¥108.00", color: "primary" },
        ]},
        { type: "alert", variant: "info", text: "凭此小票 7 日内可开具电子发票。" },
        { type: "stack", gap: "sm", align: "center", children: [{ type: "qrcode", value: "https://docsmith.cn/receipt/DS-2609-0912", size: 64, caption: "扫码开发票" }] },
        { type: "text", text: "谢谢惠顾 · 欢迎再来", variant: "xs", align: "center", color: "mutedForeground" },
      ],
    },
  },

  /* ═══════════════ 个人简历 ═══════════════ */
  {
    id: "resume",
    name: "个人简历",
    emoji: "📄",
    desc: "单页技能矩阵简历，条目化经历 + 能力条形图",
    features: ["Section", "List(descriptive)", "Graph(horizontal-bar)", "Badge", "KeyValue"],
    spec: {
      theme: "professional",
      metadata: { title: "赵梦龙 · 前端工程师简历", lang: "zh-CN" },
      page: { size: "a4", margin: 44 },
      body: [
        { type: "stack", gap: "sm", children: [
          { type: "heading", text: "赵梦龙", level: 1, noMargin: true },
          { type: "text", text: "高级前端工程师 · 智能文档方向", variant: "lg", color: "primary", noMargin: true },
          { type: "key-value", size: "sm", items: [
            { label: "电话", value: "138-XXXX-XXXX" },
            { label: "邮箱", value: "zhaomenglong@example.com" },
            { label: "坐标", value: "杭州 · 可出差" },
            { label: "主页", value: "docsmith.cn/zhao" },
          ]},
        ]},
        { type: "divider" },
        {
          type: "section",
          title: "个人简介",
          spacing: "md",
          children: [
            {
              type: "text",
              text: "6 年前端研发经验，专注富文档与出版级排版系统。主导过 3 个从 0 到 1 的 B 端编辑器项目，热心开源，pdfcn 中文生态贡献者。",
            },
          ],
        },
        {
          type: "section",
          title: "核心技能",
          spacing: "md",
          children: [
            {
              type: "graph",
              variant: "horizontal-bar",
              data: [
                { label: "React 全家桶", value: 95 },
                { label: "CSS 排版引擎", value: 88 },
                { label: "Node/Rust 工具链", value: 80 },
                { label: "可视化 (SVG/Canvas)", value: 76 },
              ],
              showValues: false,
              height: 190,
            },
          ],
        },
        {
          type: "section",
          title: "工作经历",
          spacing: "md",
          children: [
            {
              type: "list",
              variant: "descriptive",
              gap: "md",
              items: [
                {
                  text: "云链科技 · 高级前端工程师（2023.06 至今）",
                  description: "主导智能文档平台前端架构；建设 DSL→PDF 渲染管线，峰值日产 40 万份票据；带领 5 人小组。",
                },
                {
                  text: "星图互动 · 前端工程师（2020.07 - 2023.05）",
                  description: "负责低代码搭建引擎；实现组件市场与物料规范，沉淀 120+ 业务组件。",
                },
              ],
            },
          ],
        },
        {
          type: "section",
          title: "教育 & 认证",
          spacing: "md",
          children: [
            { type: "list", variant: "bullet", items: [
              { text: "浙江大学 · 软件工程 本科（2016 - 2020）" },
              { text: "PMP 项目管理认证（2024）" },
            ]},
            { type: "stack", gap: "sm", children: [
              { type: "badge", label: "React", variant: "primary" },
              { type: "badge", label: "Rust", variant: "outline" },
              { type: "badge", label: "PDF 规范", variant: "outline" },
            ]},
          ],
        },
      ],
    },
  },

  /* ═══════════════ 服务合同 ═══════════════ */
  {
    id: "contract",
    name: "服务合同",
    emoji: "📜",
    desc: "多页合同：编号页眉、条款编号列表、表格价目、双签章",
    features: ["PageHeader/Footer", "List(numbered)", "DataTable", "Form 留白", "Signature", "多页 PageBreak"],
    spec: {
      theme: "corporate",
      metadata: { title: "技术服务合同 DS-2026-042", lang: "zh-CN" },
      page: { size: "a4" },
      header: { title: "技术服务合同", subtitle: "合同编号 DS-2026-042", variant: "simple" },
      footer: { left: "杭州云链科技有限公司", pageNumbers: true },
      outline: true,
      body: [
        { type: "heading", text: "技 术 服 务 合 同", level: 1, align: "center" },
        { type: "text", text: "合同编号：DS-2026-042 ｜ 签订地：杭州市", align: "center", variant: "sm", color: "mutedForeground" },
        { type: "divider", variant: "solid" },
        {
          type: "key-value",
          items: [
            { label: "甲方", value: "上海明眸文化传媒有限公司" },
            { label: "乙方", value: "杭州云链科技有限公司" },
          ],
          size: "md",
        },
        {
          type: "section",
          title: "第一条 · 服务内容",
          spacing: "md",
          children: [
            { type: "text", text: "乙方向甲方提供智能文档生成系统的部署、定制开发与技术培训服务，具体范围如下：" },
            { type: "list", variant: "numbered", items: [
              { text: "文档引擎私有化部署（生产级集群）" },
              { text: "发票 / 报告模板定制开发共 12 套" },
              { text: "双方系统对接联调与上线护航" },
              { text: "乙方运维团队操作培训（含教材）" },
            ]},
          ],
        },
        {
          type: "section",
          title: "第二条 · 合同价款",
          spacing: "md",
          children: [
            {
              type: "data-table",
              columns: [
                { key: "item", header: "款项" },
                { key: "amount", header: "金额（元）", align: "right" },
                { key: "note", header: "备注" },
              ],
              rows: [
                { item: "部署实施费", amount: "180,000", note: "一次性" },
                { item: "模板定制费", amount: "348,000", note: "12 套 × 29,000" },
                { item: "年度服务费", amount: "120,000", note: "含 SLA 99.9%" },
              ],
              footer: { item: "合计", amount: "648,000" },
            },
          ],
        },
        {
          type: "section",
          title: "第三条 · 交付与验收",
          spacing: "md",
          children: [
            { type: "text", text: "乙方应于合同生效后 60 个工作日内完成全部交付。验收标准：连续 7 日稳定运行，文档渲染准确率 ≥ 99.99%。" },
            { type: "alert", variant: "warning", title: "知识产权", text: "定制开发的模板知识产权归甲方所有，乙方保留底层引擎的权利。" },
          ],
        },
        { type: "page-break" },
        {
          type: "section",
          title: "第四条 · 违约责任",
          spacing: "md",
          children: [
            { type: "text", text: "任何一方违约，应向守约方支付合同总额 10% 的违约金；逾期交付的，每逾期一日按合同总额的 0.5‰ 另行支付。" },
          ],
        },
        {
          type: "section",
          title: "第五条 · 签署",
          spacing: "md",
          children: [
            { type: "text", text: "本合同一式肆份，甲乙双方各执贰份，自双方盖章之日起生效。" },
            { type: "form", title: "法人授权签署栏", groups: [
              { title: "甲方确认", fields: [{ label: "签署人" }, { label: "日期" }], layout: "two-column" },
              { title: "乙方确认", fields: [{ label: "签署人" }, { label: "日期" }], layout: "two-column" },
            ]},
            { type: "signature", variant: "double", signers: [
              { label: "甲方（盖章）", name: "李明眸", title: "法定代表人" },
              { label: "乙方（盖章）", name: "陈远山", title: "法定代表人" },
            ]},
          ],
        },
      ],
    },
  },

  /* ═══════════════ 组件速查手册 ═══════════════ */
  {
    id: "cheatsheet",
    name: "组件速查手册",
    emoji: "📖",
    desc: "一页看全 19 种 DSL 节点的真实渲染效果，边看边学",
    features: ["全部节点类型", "9 主题切换试炼场"],
    spec: {
      theme: "vivid",
      metadata: { title: "文匠 DSL 组件速查", lang: "zh-CN" },
      page: { size: "a4" },
      header: { title: "文匠 DocSmith", subtitle: "DSL 速查手册", variant: "branded" },
      footer: { center: "用 JSON 写文档，像搭积木一样", pageNumbers: true },
      body: [
        { type: "heading", text: "DSL 组件速查手册", level: 1 },
        { type: "text", text: "每种节点对应一个 pdfcn 组件。改右侧 JSON，左侧立即出新 PDF。" },
        { type: "divider", label: "文本类" },
        { type: "text", text: "正文文字（text 节点）——支持粗体、颜色、对齐、删除线等排版属性。" },
        { type: "heading", text: "二级标题（heading 节点）", level: 2 },
        { type: "link", text: "链接节点：点我访问 pdfcn.dev", href: "https://www.pdfcn.dev" },
        { type: "badge", label: "badge 徽章", variant: "primary" },
        { type: "divider", label: "容器类" },
        { type: "card", title: "card 卡片", variant: "bordered", children: [
          { type: "text", text: "卡片内可以嵌套任意节点，形成组合布局。" },
        ]},
        { type: "section", title: "section 小节（自带标题样式）", spacing: "sm", children: [
          { type: "stack", gap: "sm", children: [
            { type: "alert", variant: "success", title: "alert 提示", text: "info / success / warning / error 四种语义。" },
            { type: "alert", variant: "warning", text: "不带图标与标题的极简形态。" },
          ]},
        ]},
        { type: "keep-together", children: [
          { type: "text", text: "↑ keep-together 包住的内容不会被分页截断（跨页时整体搬到下一页）。" },
        ]},
        { type: "divider", label: "数据类" },
        { type: "data-table", stripe: true, size: "compact", columns: [
          { key: "node", header: "节点" },
          { key: "comp", header: "对应组件" },
          { key: "star", header: "推荐度", align: "right" },
        ], rows: [
          { node: "data-table", comp: "DataTable", star: "★★★★★" },
          { node: "graph", comp: "PdfGraph", star: "★★★★☆" },
          { node: "key-value", comp: "KeyValue", star: "★★★★★" },
        ]},
        { type: "list", variant: "checklist", items: [
          { text: "list 支持 bullet / numbered / checklist / descriptive", checked: true },
          { text: "form 可生成手写留白区", checked: true },
          { text: "qrcode 水印签名一样都不能少", checked: false },
        ]},
        { type: "graph", variant: "area", title: "graph 图表（area 示例）", data: [
          { label: "周一", value: 12 }, { label: "周二", value: 19 }, { label: "周三", value: 15 },
          { label: "周四", value: 25 }, { label: "周五", value: 22 },
        ], smooth: true, showGrid: true, height: 170 },
        { type: "divider", label: "媒体类" },
        { type: "stack", gap: "md", children: [
          { type: "qrcode", value: "https://www.pdfcn.dev", size: 84, caption: "qrcode 节点 → 扫码逛 pdfcn 文档" },
          { type: "signature", label: "signature 签名", name: "文小匠", date: "2026-09-09" },
        ]},
      ],
    },
  },
];

export const PRESET_MAP = Object.fromEntries(PRESETS.map((p) => [p.id, p]));
