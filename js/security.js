/* ============================================================
   클라이언트 보안 모듈 (all-pick / ollaf / internetstore 공통)
   - 폼 제출 전 공격 패턴 검사
   - Honeypot 필드 자동 주입
   - 이중 제출 방지
============================================================ */
(function(){
  'use strict';
  if (window.__ollafSecurityLoaded) return;
  window.__ollafSecurityLoaded = true;

  var ATTACK_PATTERNS = [
    /<script\b/i, /<sCRiPt/i, /<\/script>/i,
    /javascript\s*:/i, /vbscript\s*:/i, /data\s*:\s*text\/html/i,
    /on(error|load|click|focus|mouseover|change|submit|input|keyup|mousedown|animationstart|wheel|touchstart)\s*=/i,
    /<iframe\b/i, /<object\b/i, /<embed\b/i, /<svg[^>]*on/i, /<meta[^>]*http-equiv/i,
    /document\.(cookie|domain|write|writeln|location)/i,
    /window\.(location|open|__)/i,
    /\beval\s*\(/i, /\bFunction\s*\(.*return/i,
    /union\s+select/i, /\bor\s+1\s*=\s*1\b/i, /'\s*or\s*'\s*'\s*=\s*'/i,
    /\${jndi:/i, /\${ldap:/i,
    /\r\n|%0A|%0D/i,
    /(?:^|\n)\s*(bcc|cc|content-type|mime-version|from)\s*:/i,
    /artex[0-9]|probe-test@|maxxspace|nikto|sqlmap/i,
    /@example\.(com|org|net)|nonexistent-domain/i
  ];

  window.__ollafDetectAttack = function(val) {
    if (val == null) return null;
    var s = String(val);
    if (s.length > 5000) return { reason: 'too_long' };
    for (var i = 0; i < ATTACK_PATTERNS.length; i++) {
      if (ATTACK_PATTERNS[i].test(s)) return { reason: 'pattern', pattern: ATTACK_PATTERNS[i].toString() };
    }
    return null;
  };

  /* 폼 자동 보호: data-ollaf-secure 속성 있는 모든 form 자동 적용 */
  function injectHoneypot(form) {
    if (form.querySelector('[data-ollaf-honeypot]')) return;
    var hp = document.createElement('input');
    hp.type = 'text';
    hp.name = 'website';
    hp.setAttribute('autocomplete', 'off');
    hp.setAttribute('tabindex', '-1');
    hp.setAttribute('data-ollaf-honeypot', '1');
    hp.setAttribute('aria-hidden', 'true');
    hp.style.cssText = 'position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important;';
    form.appendChild(hp);
  }

  function hookForm(form) {
    if (form.__ollafSecHooked) return;
    form.__ollafSecHooked = true;
    injectHoneypot(form);
    var _lastSubmitAt = 0;
    form.addEventListener('submit', function(e) {
      /* 이중 제출 방지 (3초 쿨다운) */
      var now = Date.now();
      if (now - _lastSubmitAt < 3000) { e.preventDefault(); return false; }
      _lastSubmitAt = now;
      /* Honeypot 체크 */
      var hp = form.querySelector('[data-ollaf-honeypot]');
      if (hp && hp.value) {
        console.warn('[security] honeypot triggered');
        e.preventDefault();
        return false;
      }
      /* 모든 input/textarea 값 검사 */
      var inputs = form.querySelectorAll('input, textarea');
      for (var i = 0; i < inputs.length; i++) {
        var el = inputs[i];
        if (el.type === 'hidden' || el.type === 'password') continue;
        var hit = window.__ollafDetectAttack(el.value);
        if (hit) {
          e.preventDefault();
          alert('비정상 입력이 감지되어 제출할 수 없습니다. 입력 내용을 확인해주세요.');
          console.warn('[security] attack blocked:', el.name, hit);
          return false;
        }
      }
    }, true);
  }

  function scan() {
    document.querySelectorAll('form').forEach(hookForm);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }
  /* 동적으로 form이 추가되는 경우도 커버 — MutationObserver */
  try {
    new MutationObserver(function(muts){
      muts.forEach(function(m){
        m.addedNodes && m.addedNodes.forEach(function(n){
          if (n.nodeType === 1 && n.tagName === 'FORM') hookForm(n);
          if (n.nodeType === 1 && n.querySelectorAll) n.querySelectorAll('form').forEach(hookForm);
        });
      });
    }).observe(document.body || document.documentElement, { childList: true, subtree: true });
  } catch(e) {}

  /* 노출 */
  window.__ollafSecurityScan = scan;
})();
