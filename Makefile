.PHONY: all web mobile build clean exp sync-tokens install ios android

all:
	pnpm turbo run dev

web:
	pnpm turbo run dev --filter=@gi-lab/web

mobile:
	pnpm turbo run dev --filter=@gi-lab/mobile

ios:
	pnpm --filter=@gi-lab/mobile exec expo run:ios

android:
	pnpm --filter=@gi-lab/mobile exec expo run:android

build:
	pnpm turbo run build

install:
	pnpm install

sync-tokens:
	npx tsx scripts/sync-tokens.ts

# Usage:
# make exp name=my-exp type=web        # Scaffold a merged R3F + SCSS web experiment
# make exp name=my-exp type=web-native # Scaffold a standalone native web experiment
# make exp name=my-exp type=mobile     # Scaffold a native mobile experiment
exp:
	@test -n "$(name)" || (echo "❌  Usage: make exp name=<experiment-name> type=<web|web-native|mobile>" && exit 1)
	npx tsx scripts/new-exp.ts --name=$(name) --type=$(or $(type),web)

clean:
	pnpm turbo run clean
	rm -rf node_modules

type-check:
	pnpm turbo run type-check

lint:
	pnpm turbo run lint
