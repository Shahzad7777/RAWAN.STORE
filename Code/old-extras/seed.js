/* RAWAN — Dummy Data Seed. Auto-runs once on first page load. */
window.animateTrackingSteps = function() {
  document.querySelectorAll('.t-step').forEach(function(el, i) {
    setTimeout(function() { el.classList.add('in'); }, i * 150);
  });
};

(function seedDummyOrders() {
  if (localStorage.getItem('RAWAN_seeded')) return;
  var now = Date.now();
  function ago(days) { return new Date(now - days * 86400000).toISOString(); }

  var orders = [
    { id:'QD-001', status:'delivered', customer:{name:'Hamza Raza',phone:'03211234567',address:'House 12 Block C Johar Town',city:'Lahore'}, items:[{name:'The Saba Loafer',size:'42',color:'Espresso',qty:1,price:8999,image:'images/products/saba-1.jpg'}], subtotal:8999,delivery:0,discount:0,total:8999, paymentMethod:'cod',rtoRisk:false, courier:'TCS',trackingId:'TCS-3849201', createdAt:ago(8), timeline:{pending:ago(8),confirmed:ago(7),packed:ago(6),dispatched:ago(5),delivered:ago(2)} },
    { id:'QD-002', status:'dispatched', customer:{name:'Sana Malik',phone:'03451234567',address:'Flat 4B Clifton Block 5',city:'Karachi'}, items:[{name:'The Zara Ballet Flat',size:'38',color:'Dusty Rose',qty:1,price:7299,image:'images/products/zara-1.jpg'}], subtotal:7299,delivery:0,discount:0,total:7299, paymentMethod:'bank',rtoRisk:false, courier:'Leopards',trackingId:'LEP-928471', createdAt:ago(3), timeline:{pending:ago(3),confirmed:ago(2),packed:ago(1.5),dispatched:ago(0.5)} },
    { id:'QD-003', status:'confirmed', customer:{name:'Usman Arif',phone:'03001234567',address:'Street 9 F-7/2',city:'Islamabad'}, items:[{name:'The Hayat Chelsea Boot',size:'42',color:'Cognac Tan',qty:1,price:13999,image:'images/products/dastoor-1.jpg'},{name:'The Saba Loafer',size:'42',color:'Tan',qty:1,price:8999,image:'images/products/saba-1.jpg'}], subtotal:22998,delivery:0,discount:2300,total:20698, paymentMethod:'bank',rtoRisk:false, createdAt:ago(1), timeline:{pending:ago(1),confirmed:ago(0.5)} },
    { id:'QD-004', status:'pending', customer:{name:'Fatima Noor',phone:'03331234567',address:'Model Town Block E',city:'Multan'}, items:[{name:'The Mehr Slip-On',size:'40',color:'Ivory',qty:1,price:7499,image:'images/products/mehr-1.jpg'}], subtotal:7499,delivery:250,discount:0,total:7749, paymentMethod:'cod',rtoRisk:false, createdAt:new Date(now-7200000).toISOString(), timeline:{pending:new Date(now-7200000).toISOString()} },
    { id:'QD-005', status:'pending', customer:{name:'Bilal Ahmed',phone:'03121234567',address:'Gulshan-e-Iqbal Block 13',city:'Karachi'}, items:[{name:'The Raah Runner',size:'41',color:'Cloud',qty:1,price:9499,image:'images/products/raah-1.jpg'}], subtotal:9499,delivery:0,discount:0,total:9499, paymentMethod:'cod',rtoRisk:true,rtoReason:'Multiple cancelled orders', createdAt:new Date(now-3600000).toISOString(), timeline:{pending:new Date(now-3600000).toISOString()} },
    { id:'QD-006', status:'delivered', customer:{name:'Ali Mirza',phone:'03561234567',address:'Wapda Town Phase 2',city:'Lahore'}, items:[{name:'The Dastoor Formal',size:'43',color:'Oxford Black',qty:1,price:12499,image:'images/products/dastoor-1.jpg'}], subtotal:12499,delivery:0,discount:1250,total:11249, paymentMethod:'bank',rtoRisk:false, courier:'M&P',trackingId:'MNP-7364892', createdAt:ago(14), timeline:{pending:ago(14),confirmed:ago(13),packed:ago(12),dispatched:ago(10),delivered:ago(7)} },
    { id:'QD-007', status:'packed', customer:{name:'Maryam Qadir',phone:'03021234567',address:'Bahria Town Phase 4',city:'Rawalpindi'}, items:[{name:'The Noor Sandal',size:'39',color:'Gold',qty:1,price:6999,image:'images/products/noor-1.jpg'}], subtotal:6999,delivery:250,discount:0,total:7249, paymentMethod:'cod',rtoRisk:false, createdAt:ago(2), timeline:{pending:ago(2),confirmed:ago(1.5),packed:new Date(now-21600000).toISOString()} },
    { id:'QD-008', status:'cancelled', customer:{name:'Kamran Shah',phone:'03091234567',address:'Cantt Area',city:'Faisalabad'}, items:[{name:'The Safar Everyday',size:'42',color:'Navy',qty:1,price:7999,image:'images/products/zara-1.jpg'}], subtotal:7999,delivery:250,discount:0,total:8249, paymentMethod:'cod',rtoRisk:true,rtoReason:'Number not reachable', createdAt:ago(5), timeline:{pending:ago(5),cancelled:ago(4.5)} }
  ];

  var rtoLedger = {
    '03121234567': { reason: 'Multiple cancelled orders', flaggedAt: new Date().toISOString() },
    '03091234567': { reason: 'Number not reachable', flaggedAt: new Date().toISOString() }
  };
  var countdown = { target: new Date(now + 3*86400000).toISOString(), label: 'Drop 01 Ends' };

  localStorage.setItem('RAWAN_orders', JSON.stringify(orders));
  localStorage.setItem('RAWAN_rto_ledger', JSON.stringify(rtoLedger));
  localStorage.setItem('RAWAN_countdown', JSON.stringify(countdown));
  localStorage.setItem('RAWAN_seeded', '1');

  if (window.Store) {
    Store.orders = orders;
    Store.rtoLedger = rtoLedger;
    Store.countdownConfig = countdown;
  }
})();

