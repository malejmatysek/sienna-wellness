/* Storage layer. The app only talks to SIENNA.Store; the adapter is swappable.
   Later: SIENNA.Store.adapter = SupabaseAdapter ({ load(key), save(key, state) }) for accounts + sync. */
window.SIENNA = window.SIENNA || {};
SIENNA.LocalAdapter = {
  load(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn('save failed', e); } }
};
SIENNA.Store = {
  key: 'sienna:v1', adapter: SIENNA.LocalAdapter, state: null, subs: [],
  init() { this.state = Object.assign({ version: 1, profile: null, days: {}, reset: {} }, this.adapter.load(this.key) || {}); return this.state; },
  get() { return this.state; },
  update(fn, silent) { fn(this.state); this.state.updatedAt = Date.now(); this.adapter.save(this.key, this.state); if (!silent) this.subs.forEach(f => f(this.state)); },
  subscribe(f) { this.subs.push(f); }
};
