/**
 * studio/src/schemaTypes/objects/blockContent.ts
 * Portable Text field used as the body of all rich-text documents.
 *
 * Follows Sanity best practices:
 * - defineType for the root export
 * - defineArrayMember for all array items
 * - External links use url type (allows validation)
 */
import { defineType, defineArrayMember, defineField } from 'sanity';
import { ImageIcon } from '@sanity/icons';

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal',     value: 'normal'     },
        { title: 'Heading 2',  value: 'h2'         },
        { title: 'Heading 3',  value: 'h3'         },
        { title: 'Heading 4',  value: 'h4'         },
        { title: 'Quote',      value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet',   value: 'bullet'   },
        { title: 'Numbered', value: 'number'   },
      ],
      marks: {
        decorators: [
          { title: 'Strong',         value: 'strong' },
          { title: 'Emphasis',       value: 'em'     },
          { title: 'Code (inline)',  value: 'code'   },
        ],
        annotations: [
          {
            name: 'link',
            title: 'URL',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) =>
                  rule
                    .uri({ scheme: ['http', 'https', 'mailto', 'tel'] })
                    .required()
                    .error('A valid URL is required.'),
              }),
              defineField({
                name: 'blank',
                title: 'Open in new tab',
                type: 'boolean',
                initialValue: false,
                description: 'When enabled, link opens in a new browser tab.',
              }),
            ],
          },
        ],
      },
    }),

    // Inline image block
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Describe the image for screen readers and search engines.',
          validation: (rule) =>
            rule.required().error('Alt text is required for accessibility.'),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional caption shown below the image.',
        }),
      ],
    }),
  ],
});
