# ──────────────────────────────────────────────────────────────
# sofrah_app Makefile
#
# FIX: المشروع داخل iCloud Drive (Desktop) فيضيف iCloud
#      com.apple.FinderInfo على مجلدات build الجديدة مما يسبب
#      فشل codesign. الحل: نوجّه build/ كـ symlink خارج iCloud.
#
# الاستخدام:
#   make            ← يطبع المساعدة
#   make setup      ← ينشئ symlink مرة واحدة (أو بعد flutter clean)
#   make ios        ← setup + flutter build ios
#   make ios-run    ← setup + flutter run
#   make clean      ← flutter clean + يعيد إنشاء الـ symlink
# ──────────────────────────────────────────────────────────────

EXTERNAL_BUILD := $(HOME)/Library/Caches/flutter_builds/sofrah_app

.PHONY: help setup ios ios-run clean

help:
	@echo ""
	@echo "  make setup     أنشئ build/ symlink (مطلوب بعد كل flutter clean)"
	@echo "  make ios       build iOS release"
	@echo "  make ios-run   flutter run (debug)"
	@echo "  make clean     flutter clean + أعد إنشاء الـ symlink"
	@echo ""

setup:
	@mkdir -p "$(EXTERNAL_BUILD)"
	@if [ -L build ]; then \
		echo "✓ build symlink موجود بالفعل"; \
	elif [ -d build ]; then \
		echo "⚠ build/ مجلد حقيقي — نحوّله إلى symlink..."; \
		rm -rf build; \
		ln -s "$(EXTERNAL_BUILD)" build; \
		echo "✓ تم"; \
	else \
		ln -s "$(EXTERNAL_BUILD)" build; \
		echo "✓ build -> $(EXTERNAL_BUILD)"; \
	fi

ios: setup
	flutter build ios --release

ios-run: setup
	flutter run

clean:
	flutter clean
	@$(MAKE) --no-print-directory setup
