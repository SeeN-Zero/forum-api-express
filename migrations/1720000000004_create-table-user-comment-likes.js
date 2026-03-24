export const up = (pgm) => {
  /* eslint-disable camelcase */
  pgm.createTable('user_comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"comments"',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('user_comment_likes', 'unique_user_comment_like', {
    unique: ['user_id', 'comment_id'],
  });
  /* eslint-enable camelcase */
};

export const down = (pgm) => {
  pgm.dropTable('user_comment_likes', {
    ifExists: true,
    cascade: true,
  });
};
