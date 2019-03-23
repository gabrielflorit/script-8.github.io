import _ from 'lodash'
import isDirty from './isDirty.js'

const canRecord = ({
  gist,
  token,
  game,
  sprites,
  map,
  phrases,
  chains,
  songs,
  iframeVersion
}) => {
  const dirty = isDirty({
    gist,
    game,
    sprites,
    map,
    phrases,
    chains,
    songs,
    iframeVersion
  })

  // If gistLogin is null, gist was created anonymously.
  const gistLogin = _.get(gist, 'data.owner.login', null)

  // If gistLogin does not match currentLogin, gist wasn't created by us.
  const currentLogin = _.get(token, 'user.login', null)

  // RECORD can only be enabled when:
  // - the gist is ours AND content is dirty
  // - OR the gist is empty (new game)
  const enableRecord =
    (currentLogin && currentLogin === gistLogin && dirty) || _.isEmpty(gist)

  return enableRecord
}

export default canRecord
