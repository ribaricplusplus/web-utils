import assert from "assert";

interface FlexObserverOptions {
  flexContainer: HTMLElement;
  changeCallback?: (wrappedElements: Set<HTMLElement>) => unknown;
}

export default class FlexObserver {
  private flexContainer: HTMLElement | null = null;
  private observing: boolean = false;
  private changeCallback: FlexObserverOptions["changeCallback"] = undefined;

  public wrappedElements: Set<HTMLElement> = new Set();

  observe(options: FlexObserverOptions) {
    this.flexContainer = options.flexContainer;
    if (options.changeCallback) {
      this.changeCallback = options.changeCallback;
    }
    this.observing = true;

    this.initFlexWrapObserver();
  }

  initFlexWrapObserver() {
    assert(this.flexContainer);

    // There have to be at least 2 elements
    if (this.flexContainer.children.length < 2) {
      return;
    }

    const observerCb = () => {
      if (
        !this.observing ||
        !this.flexContainer ||
        this.flexContainer.children.length < 2
      ) {
        return;
      }

      const rect = this.flexContainer.children[0].getBoundingClientRect();
      const bottomLine = rect.y + rect.height;
      const prevSetSize = this.wrappedElements.size;

      for (let i = 1; i < this.flexContainer.children.length; ++i) {
        const element = this.flexContainer.children[i] as HTMLElement;
        const topLine = element.getBoundingClientRect().y;
        // Element is below bottom line
        if (topLine > bottomLine) {
          this.wrappedElements.add(element);
        } else {
          this.wrappedElements.delete(element);
        }
      }

      if (prevSetSize !== this.wrappedElements.size && this.changeCallback) {
        this.changeCallback(this.wrappedElements);
      }

      window.requestAnimationFrame(observerCb);
    };

    window.requestAnimationFrame(observerCb);
  }

  unobserve() {
    this.observing = false;
  }
}
