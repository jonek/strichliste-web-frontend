import * as React from 'react';

import { usePopularArticles } from '../../store';
import { Article, startLoadingArticles } from '../../store/reducers';
import { Currency } from '../currency';
import { ArticleValidator } from './validator';
import { Flex, Input, CancelButton, Button, CardGrid } from '../../bricks';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import styles from './article-selection-bubbles.module.css';

interface Props {
  userId: string;
  onSelect(article: Article): void;
  onCancel(): void;
}

const ARTICLE_BUBBLE_LIMIT = 20;
export const ArticleSelectionBubbles = (props: Props) => {
  const items = usePopularArticles();
  const dispatch = useDispatch();
  const intl = useIntl();
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    startLoadingArticles(dispatch, true);
  }, [dispatch]);

  return (
    <div>
      <Flex>
        <Input
          placeholder={intl.formatMessage({ id: 'BUY_ARTICLE_PLACEHOLDER' })}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <CancelButton margin="0 0 0 1rem" onClick={props.onCancel} />
      </Flex>
      <CardGrid>
        {items
          .filter(
            (item) =>
              !query || item.name.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, ARTICLE_BUBBLE_LIMIT)
          .map((item) => (
            <ArticleValidator
              key={item.name}
              userId={props.userId}
              value={item.amount}
              render={(isValid) => (
                <Button
                  className={styles.articleButton}
                  primary
                  disabled={!isValid}
                  onClick={() => {
                    if (isValid) {
                      props.onSelect(item);
                    }
                  }}
                >
                  <div className={styles.name}>{item.name}</div>
                  <Currency hidePlusSign value={item.amount} />
                </Button>
              )}
            />
          ))}
      </CardGrid>
    </div>
  );
};
