select ponto_id, classificacao_id, sum(valor), 
(valor * classificacao_id) as valorClassificacao,
( sum(valor) / sum(valor * classificacao_id) ) as media

from usuarios_ponto_class a

group by ponto_id
order by ponto_id, classificacao_id;