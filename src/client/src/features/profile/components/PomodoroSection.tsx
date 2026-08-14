import { useState, useEffect, useCallback, useMemo } from 'react';
import { pomodoroConfigApi } from '@/features/focus/api/focus.api';
import type { PomodoroConfig } from '@/features/focus/types/focus.types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const DEFAULT_CONFIG: PomodoroConfig = {
  work: 25,
  short_break: 5,
  long_break: 15,
  cycles: 4,
  sound: true,
};

const BOUNDS = {
  work: { min: 1, max: 120 },
  short_break: { min: 1, max: 60 },
  long_break: { min: 1, max: 60 },
  cycles: { min: 1, max: 10 },
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} phút`;
  if (minutes === 0) return `${hours} giờ`;
  return `${hours} giờ ${minutes} phút`;
}

interface NumericFieldProps {
  id: string;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

function NumericField({ id, label, value, unit, min, max, onChange }: NumericFieldProps) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 text-[12.5px]">
        {label}
      </Label>
      <div className="bg-card border-border rounded-field focus-within:outline-ring flex items-center gap-1.5 border px-2.5 py-2 focus-within:border-transparent focus-within:outline-2 focus-within:outline-offset-1">
        <input
          id={id}
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const raw = parseInt(e.target.value, 10);
            if (!Number.isNaN(raw)) onChange(clamp(raw, min, max));
          }}
          className="text-foreground w-full min-w-0 border-0 bg-transparent p-0 font-mono text-sm font-medium tabular-nums outline-none"
        />
        <span className="text-muted-foreground flex-none text-[11.5px]">{unit}</span>
      </div>
    </div>
  );
}

export function PomodoroSection() {
  const [config, setConfig] = useState<PomodoroConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    pomodoroConfigApi
      .get()
      .then((data) => {
        if (!cancelled) {
          setConfig(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const total = useMemo(
    () =>
      config.cycles * config.work + (config.cycles - 1) * config.short_break + config.long_break,
    [config]
  );

  const segments = useMemo(() => {
    const segs: { type: 'work' | 'short' | 'long'; minutes: number; pct: number }[] = [];
    for (let i = 0; i < config.cycles; i++) {
      segs.push({ type: 'work', minutes: config.work, pct: (config.work / total) * 100 });
      if (i < config.cycles - 1) {
        segs.push({
          type: 'short',
          minutes: config.short_break,
          pct: (config.short_break / total) * 100,
        });
      }
    }
    segs.push({ type: 'long', minutes: config.long_break, pct: (config.long_break / total) * 100 });
    return segs;
  }, [config, total]);

  const updateField = useCallback(
    <K extends keyof PomodoroConfig>(key: K, value: PomodoroConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await pomodoroConfigApi.update(config);
      setConfig(updated);
    } catch {
      setError('Không thể lưu cấu hình. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  }, [config]);

  const mathExpr = `${config.cycles} × ${config.work} + ${config.cycles - 1} × ${config.short_break} + ${config.long_break} = ${total}`;

  if (loading) {
    return (
      <section
        id="pomodoro"
        className="border-border grid gap-3 border-t py-8 max-md:gap-y-4 md:grid-cols-[236px_minmax(0,1fr)] md:gap-x-11"
        style={{ scrollMarginTop: 24 }}
      >
        <div />
        <div className="bg-muted h-48 animate-pulse rounded-xl" />
      </section>
    );
  }

  return (
    <section
      id="pomodoro"
      className="border-border grid gap-3 border-t py-8 max-md:gap-y-4 md:grid-cols-[236px_minmax(0,1fr)] md:gap-x-11"
      style={{ scrollMarginTop: 24 }}
    >
      {/* Aside */}
      <div>
        <h2 className="font-heading mb-1.5 text-[17px] leading-[1.3] tracking-[-0.015em]">
          Chu kỳ Pomodoro
        </h2>
        <p className="text-muted-foreground mb-2.5 text-[12.5px] leading-[1.7]">
          Mặc định áp cho mọi phiên học mới. Đang chạy dở thì không đổi giữa chừng — phiên hiện tại
          giữ nguyên cấu hình lúc bắt đầu.
        </p>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-muted-foreground border-border bg-card rounded-[4px] border px-1.5 py-px font-mono text-[11px]">
            FS-02
          </span>
          <span className="text-muted-foreground border-border bg-card rounded-[4px] border px-1.5 py-px font-mono text-[11px]">
            users.pomodoro_config
          </span>
        </div>
      </div>

      {/* Controls */}
      <div>
        {/* Cycle visualization */}
        <div className="bg-muted border-border mb-5.5 rounded-[calc(var(--radius)*0.8)] border px-4 pb-3 pt-3.5">
          {/* Bar */}
          <div className="mb-2.5 flex h-7 gap-0.5" aria-hidden="true">
            {segments.map((seg, i) => (
              <div
                key={i}
                className={`grid min-w-0 place-items-center overflow-hidden rounded-[3px] font-mono text-[10.5px] ${
                  seg.type === 'work'
                    ? 'text-focus-session border border-[oklch(from_var(--focus-session)_l_c_h/0.32)] bg-[oklch(from_var(--focus-session)_l_c_h/0.16)] font-medium'
                    : seg.type === 'long'
                      ? 'text-muted-foreground border border-[oklch(from_var(--muted-foreground)_l_c_h/0.6)] bg-[oklch(from_var(--muted-foreground)_l_c_h/0.24)] font-medium'
                      : 'text-muted-foreground bg-[oklch(from_var(--muted-foreground)_l_c_h/0.24)]'
                }`}
                style={{ width: `${seg.pct}%` }}
              >
                {seg.type !== 'short' && seg.pct > 4 ? seg.minutes : ''}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="text-muted-foreground border-border flex flex-wrap gap-x-4 gap-y-1.5 border-b pb-2.5 text-[11.5px]">
            <span className="inline-flex items-center gap-1.5">
              <i className="block size-2.5 flex-none rounded-sm bg-[oklch(from_var(--focus-session)_l_c_h/0.35)]" />
              Học {config.work} phút
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="block size-2.5 flex-none rounded-sm bg-[oklch(from_var(--muted-foreground)_l_c_h/0.24)]" />
              Nghỉ ngắn {config.short_break} phút
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="block size-2.5 flex-none rounded-sm border border-[oklch(from_var(--muted-foreground)_l_c_h/0.6)] bg-[oklch(from_var(--muted-foreground)_l_c_h/0.24)]" />
              Nghỉ dài {config.long_break} phút
            </span>
          </div>

          {/* Total */}
          <div className="text-muted-foreground flex flex-wrap items-baseline justify-between gap-3.5 pt-2.5 text-[12.5px]">
            <span>
              Trọn một khối {config.cycles} chu kỳ mất{' '}
              <b className="text-foreground text-[13.5px] font-semibold">{formatDuration(total)}</b>
            </span>
            <span className="font-mono text-[11.5px] tabular-nums">{mathExpr}</span>
          </div>
        </div>

        {/* Grid 4 numeric inputs */}
        <div className="grid max-w-[460px] grid-cols-2 gap-3.5 md:grid-cols-4">
          <NumericField
            id="pomo-work"
            label="Học"
            value={config.work}
            unit="phút"
            {...BOUNDS.work}
            onChange={(v) => updateField('work', v)}
          />
          <NumericField
            id="pomo-short"
            label="Nghỉ ngắn"
            value={config.short_break}
            unit="phút"
            {...BOUNDS.short_break}
            onChange={(v) => updateField('short_break', v)}
          />
          <NumericField
            id="pomo-long"
            label="Nghỉ dài"
            value={config.long_break}
            unit="phút"
            {...BOUNDS.long_break}
            onChange={(v) => updateField('long_break', v)}
          />
          <NumericField
            id="pomo-cycles"
            label="Số chu kỳ"
            value={config.cycles}
            unit="lượt"
            {...BOUNDS.cycles}
            onChange={(v) => updateField('cycles', v)}
          />
        </div>

        {/* Sound switch */}
        <div className="mt-5.5 border-border flex max-w-[560px] items-start justify-between gap-6 border-t pt-5">
          <div>
            <span className="block text-[12.5px] font-medium" id="sound-label">
              Âm báo khi hết giờ
            </span>
            <p className="text-muted-foreground mt-1 max-w-[400px] text-[12px] leading-[1.65]">
              Tắt âm thì hệ thống vẫn báo bằng thay đổi trên màn hình. Phiên học không dùng hiệu ứng
              động, kể cả lúc báo hết giờ.
            </p>
          </div>
          <Switch
            checked={config.sound}
            onCheckedChange={(checked) => updateField('sound', checked === true)}
            aria-labelledby="sound-label"
            className="flex-none"
          />
        </div>

        {/* Save */}
        <div className="mt-5.5 flex items-center gap-3.5">
          <Button onClick={handleSave} loading={saving}>
            Lưu cấu hình
          </Button>
          <p
            className={`text-[12px] leading-[1.65] ${error ? 'text-mastery-weak' : 'text-muted-foreground'}`}
          >
            {error || 'Áp dụng từ phiên học tiếp theo.'}
          </p>
        </div>
      </div>
    </section>
  );
}
