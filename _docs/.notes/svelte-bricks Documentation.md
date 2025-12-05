### 📖 Core Concept and Basic Usage

**Svelte Bricks** is described as a "naive Svelte masonry component without column balancing," which results in a layout with ragged columns at the bottom . This is a common characteristic of many masonry layouts.

The main component, `Masonry.svelte`, requires two things: an array of `items` to render and a `<slot />` used to define how each item looks . Here is a basic code example to illustrate its structure:

**Basic Implementation**
```html
<script>
  import { Masonry } from 'svelte-bricks';
  // Your array of items
  let items = [/* ... */];
</script>

<Masonry {items}>
  <!-- The slot receives each individual 'item' -->
  <div slot="item" let:item>
    <!-- Define your item's markup here -->
    <h2>{item.title}</h2>
    <img src={item.image} alt={item.title}>
  </div>
</Masonry>
```

### ⚙️ Component API and Configuration

The library offers several optional props to customize its behavior . The table below summarizes the key props you can use:

| Prop Name | Type & Default Value | Description |
| :--- | :--- | :--- |
| **`items`** | `array` | The array of data to be rendered in the masonry layout (required) . |
| **`animate`** | `boolean` (default: `true`) | Controls whether to use FLIP animations when items rearrange due to viewport resizing or other events . |
| **`idKey`** | `string` | Specifies a unique identifier property on each item object. Used by Svelte's `{#each}` block to track items . |
| **`getId`** | `(item) => string | number` | A function that maps an item to its unique ID. Offers more flexibility than `idKey` . |

**A Note on Item Keys:** If your `items` array contains objects, the component needs a way to uniquely identify each one. By default, it looks for an `id` property on each item. You can change this by providing either the `idKey="yourCustomId"` prop or a `getId={(item) => item.customId}` function .

### 💡 Advanced Usage and Examples

- **Responsive Columns with Breakpoints**: While not directly part of `svelte-bricks`, a common pattern in masonry layouts (as seen in the similar `svelte-masonry-layout` package) is to control the number of columns via CSS. You can use a CSS class or inline styles on the component to set `column-count` and `column-gap` .
- **Handling Dynamic Content**: If you add, remove, or change items asynchronously (e.g., after fetching data), the masonry layout will reactively update. You can bind to a `refreshLayout` function (a pattern used in other masonry libraries) to manually trigger a layout recalculation if needed .


### 🚀 Practical Implementation for Our Project

Given your requirement to use both `ProductCard` and `MediaCard` components, here is a more concrete example. The key is to use Svelte's slot to render different components based on your data.

**Example: Mixed Card Types**
```html
<script>
  import { Masonry } from 'svelte-bricks';
  import ProductCard from './ProductCard.svelte';
  import MediaCard from './MediaCard.svelte';

  // Example items array with a 'type' to differentiate components
  let items = [
    { id: 1, type: 'product', name: 'Cool Product', price: '$99', image: '...' },
    { id: 2, type: 'media', aspectRatio: '16:9', source: '...' },
    // ... more items
  ];
</script>

<Masonry {items} idKey="id">
  <div slot="item" let:item>
    {#if item.type === 'product'}
      <ProductCard {...item} />
    {:else if item.type === 'media'}
      <MediaCard {...item} />
    {/if}
  </div>
</Masonry>
```


## **Props**
Masonry.svelte expects an array of items as well as a <slot /> component used to render each of the items. The array can contain whatever data (objects, strings, numbers) as long as the slot component knows how to handle it. Additional optional props are:

1. `animate: boolean = true` - Whether to FLIP-animate masonry items when viewport resizing or other events cause items to rearrange.
2. Function used to compute the number of columns based on the masonry width, minimum column width and gap. 
```
calcCols = (
  masonryWidth: number,
  minColWidth: number,
  gap: number,
): number => {
  return Math.min(
    items.length,
    Math.floor((masonryWidth + gap) / (minColWidth + gap)) || 1,
  )
}
```

3. "class: string = ``" - Applies to the outer div wrapping all masonry columns. For use with CSS frameworks like Tailwind.

4. "columnClass: string = ``" - Applies to each column div.

5. `duration: number = 200` - Transition duration in milli seconds when masonry items are rearranged or added/removed. Set to 0 to disable transitions.
6. `gap: number = 20` - Gap between columns and items within each column in px.
7. This is a custom function that maps masonry items to unique IDs of type string or number.
```
getId = (item: Item): string | number => {
  if (typeof item === `number`) return item
  if (typeof item === `string`) return item
  return item[idKey]
}
``` 

8. ""idKey: string = `id`"" - Name of the attribute to use as identifier if items are objects.

9. `items: Item[]` - The only required prop are the list of items to render where Item = $$Generic is a generic type which usually will be object but can also be simple types string or number.

10. `masonryHeight: number = 0` - The masonry divs height in px.
11. `masonryWidth: number = 0` - The masonry divs width in px.
12. `maxColWidth: number = 500` - Maximum column width in px.
13. `minColWidth: number = 330` - Minimum column width in px.
14. ""style: string = ``"" - Inline styles that will be applied to the top-level div.masonry.